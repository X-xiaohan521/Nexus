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
  "correctAnswerUri": "correct_answer.csv",
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

### 1. 提交流程（Producer）

```java
public void submit(Long submissionId) {

    // 1. 更新状态：PENDING
    // 2. 构造消息

    JudgeRequest msg = new JudgeRequest(
        submissionId,
        fileUri,
        UUID.randomUUID().toString()
    );

    // 3. 发送 MQ
    rabbitTemplate.convertAndSend(
        "submission.exchange",
        "judge.request",
        msg
    );
}
```

---

## 2. 接收结果（Consumer）

```java
@RabbitListener(queues = "submission.judge.result.queue")
public void handleResult(JudgeResult result) {

    submissionService.handleJudgeResult(result);
}
```

---

## 3. 结果处理

```java
@Transactional
public void handleJudgeResult(JudgeResult result) {

    Submission sub = submissionMapper.selectById(result.getSubmissionId());

    // 幂等控制（关键）
    if (sub.getStatus() != RUNNING) {
        return;
    }

    if ("SUCCESS".equals(result.getStatus())) {
        submissionMapper.updateSuccess(
            sub.getId(),
            result.getScore()
        );
    } else {
        submissionMapper.updateFailed(
            sub.getId(),
            result.getErrorMsg()
        );
    }
}
```

---

## Python Evaluator 设计

### 1. 消费任务

```python
def handle_request(body):
    msg = json.loads(body)

    submission_id = msg["submissionId"]
    file_uri = msg["fileUri"]

    try:
        score = judge(file_uri)

        result = {
            "submissionId": submission_id,
            "callbackId": msg["callbackId"],
            "status": "SUCCESS",
            "score": score,
            "errorMsg": None
        }

    except Exception as e:
        result = {
            "submissionId": submission_id,
            "callbackId": msg["callbackId"],
            "status": "FAILED",
            "score": None,
            "errorMsg": str(e)
        }

    # 发回结果队列
    channel.basic_publish(
        exchange='submission.exchange',
        routing_key='judge.result',
        body=json.dumps(result)
    )
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

用于：

* evaluator 崩溃
* 消息处理失败

