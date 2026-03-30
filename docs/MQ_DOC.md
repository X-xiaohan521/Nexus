# 消息队列架构设计

## ⭐ 核心理念
* 数据库只由 Java（Spring Boot）服务管理
* Python evaluator 只是“计算节点”，不碰数据存储

## 整体架构（数据流）

> **双队列 + 结果回传**

```text
Spring Boot → MQ(mq.evaluate.request) → Python Evaluator
                                              ↓
Database    ←    Spring Boot   ←   MQ(mq.evaluate.result)
```

---

## 消息协议设计

### 1. 请求消息（Java → Python）

```json
{
  "submissionId": 123,
  "fileUri": "/submission/xxx.csv",
  "groundTruthUri": "/",
  "callbackId": "uuid-xxx", 
  "timestamp": 1710000000
}
```

字段说明：

| 字段           | 作用                 |
| ------------ | ------------------ |
| submissionId | 主键（唯一识别）           |
| fileUri      | Python 用来读取文件的路径    |
| correctAnswerUri | 正确答案的路径   |
| callbackId   | 用于匹配请求和响应（保证一致） |
| timestamp    | 调试/过期判断            |

---

### 2. 响应消息（Python → Java）

```json
{
  "submissionId": 123,
  "callbackId": "uuid-xxx",
  "status": 1,  // 0 表示失败，1 表示成功
  "score": 0.91,   // 失败时返回 null
  "errorMsg": null   // 失败时返回错误信息（中文），成功时返回 null
}
```

---

## Java 侧设计

### 1. 提交流程（Provider）

```java
private void startEvaluating(Integer submissionId, String fileUri) {
    // 1. prepare eval request
    EvaluateRequest request = new EvaluateRequest(
            submissionId,
            fileUri,
            UUID.randomUUID().toString(),
            System.currentTimeMillis()
    );
    log.info("Sending request to evaluator: {}", request);

    // 2. send request
    evalReqProvider.sendEvalReq(request);
}

public void sendEvalReq(EvaluateRequest evalReq) {
    String msg = gson.toJson(evalReq);
    template.convertAndSend(reqQueue, msg);
}
```

---

## 2. 接收结果（Consumer）

```java
@RabbitListener(queues = {"${app.mq.result}"})
public void consumeEvalResult(String msg) {
    log.info("Got result from evaluator: {}", msg);
    EvaluateResult result = gson.fromJson(msg, EvaluateResult.class);
    submissionService.onFinishEvaluating(result);
}
```

---

## 3. 结果处理

```java
@Transactional
public void onFinishEvaluating(EvaluateResult result) {
    // 1. find the corresponding submission via submissionId
    Submission submission = submissionRepo.findById(result.submissionId()).orElse(null);
    if (submission == null) {
        log.error("Failed to save evaluate result {}: cannot find submission id {}.", result.callbackId(), result.submissionId());
        return;
    }

    // 2. check if the status is 3(running), else return
    if (!Objects.equals(3, submission.getStatus())) {
        log.warn("Failed to save evaluate result {}: status of submission id {} is not 3(running).", result.callbackId(), submission.getId());
    }

    // 3. update status 3 -> 0(failed) / 1(success)
    submission.setStatus(result.status());

    // 4. update other info
    switch (submission.getStatus()) {
        // 4.1 status: 0 -> update err_msg
        case 0:
            submission.setErrMsg(result.errorMsg());

        // 4.2 status: 1 -> update score
        case 1:
            submission.setScore(result.score());
    }

    submissionRepo.save(submission);
}
```

---

## Python Evaluator 设计

### 1. 消费任务

```python
def start_req_consumer(callback: typing.Callable[[BlockingChannel, spec.Basic.Deliver, spec.BasicProperties, bytes], None]):
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=NEXUS_MQ_HOST, port=NEXUS_MQ_PORT))
    channel = connection.channel()
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue='mq.evaluate.request', on_message_callback=callback)
    channel.start_consuming()
```

### 2. 回传结果

```python
def send_eval_result(result: str):
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=NEXUS_MQ_HOST, port=NEXUS_MQ_PORT))
    channel = connection.channel()
    channel.basic_publish(exchange='', routing_key='mq.evaluate.result', body=result)
    connection.close()
```

---

## 关键问题
### 1. 一致性 & 幂等

MQ 可能：

* 重发
* evaluator 重试

Java 侧幂等控制：

```text
只允许 RUNNING → SUCCESS / FAILED
```

```java
if (status != RUNNING) return;
```

> 保证 最终一致性 和 幂等性

---

### 2. 超时机制

防止 RUNNING 卡死

定时任务：

```sql
UPDATE submission
SET status = FAILED
WHERE status = RUNNING
AND now() - submission_time > 10min;
```

---

## 3. 死信队列

防止：一条“毒消息（Poison Message）”把整个 evaluator 集群打崩。

