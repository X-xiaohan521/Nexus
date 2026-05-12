# 分布式相关
## TaskLock 分布式任务锁设计说明

## 1. 背景

在当前系统中，存在两类并发执行、重计算的任务来源：

- A：计算排行榜（定时任务）
- B：评测提交（消息队列异步任务）

这两类任务彼此独立运行，但有概率会恰巧在同一时刻执行，导致瞬间的 CPU 资源不足，引发服务宕机。（尤其当提交繁忙，且排行榜刷新间隔较短时，引发概率更高）

由于缺乏统一的资源协调机制，在高并发场景下可能出现：

- CPU 被瞬时打满
- GC 压力剧增
- 系统整体响应下降甚至宕机

因此需要一个 **跨线程 / 跨任务类型 / 跨编程语言** 的轻量级资源互斥机制，保证两类任务不同时执行。

---

## 2. 设计目标

本锁机制（TaskLock）旨在解决以下问题：

### 2.1 全局互斥控制
确保同一时刻系统内最多只有一个重型任务执行。

### 2.2 跨执行模型统一协调
支持以下执行来源：

- Java 定时任务
- Python 评测任务

### 2.3 无外部依赖
当前设计不依赖：

- Redis
- ZooKeeper
- etcd
- Kubernetes

通过 **操作系统文件锁（File Lock）** 实现协调能力。

---

## 3. 核心设计原理

### 3.1 文件锁（File Lock）

TaskLock 基于操作系统级文件锁机制实现：

- 锁文件路径：`data/{task-name}.lock`
- 使用 `FileChannel.tryLock()` 获取锁
- 属于 **OS Advisory Lock（建议锁）**

特点：

- 跨进程生效
- **JVM** 或 **Python进程** 崩溃自动释放
- 不依赖网络
- 低开销

---

### 3.2 锁竞争模型

当多个任务同时竞争资源时：

```
当 A 任务执行前，尝试获取锁，如果锁被 B 占用，则跳过当前一轮排行榜计算，否则获取锁并执行任务，任务结束后释放锁；当 B 任务执行前，尝试获取锁，如果锁被 A 占用，则等待 5 秒再次尝试，直到获取到锁并执行，执行完释放锁。
```

---

## 4. Java 侧（封装为 TaskLock 类）

### 4.1 自动释放

```java
try (TaskLock lock = taskLockFactory.tryAcquire("heavy-task")) {
    if (lock == null) {
        log.info("Lock is occupied, skip calculating the leaderboard.");
        return;
    }
    log.info("Running scheduled task: refreshing the leaderboard...");
    leaderboardService.calculateLeaderboard();
}
````

逻辑：
- 定时任务执行前，先尝试获取锁
- 获取锁失败：直接跳过本次定时任务，下次再尝试
- 获取锁成功：开始计算排行榜，完成后释放锁

特点：
* 自动释放锁（AutoCloseable）
* 支持 try-with-resources
* 异常安全释放

### 4.2 手动释放

```java
TaskLock lock = taskLockFactory.tryAcquire("heavy-task");

if (lock != null) {
    try {
        doWork();
    } finally {
        lock.release();
    }
}
```

---

## 5. Python 侧（使用 filelock 类）

### 5.1 MQ 配置

```text
prefetch = 1
consumer concurrency = 1
manual ack = true
```

---

### 5.2 引入锁之后的消费逻辑

```python
def callback(ch, method, properties, body):
    request = body.decode()
    logger.info(f"Received evaluate request {request}")
    # get lock file
    lock = FileLock(Path(NEXUS_DATA) / "heavy-task.lock")
    while True:
        try:
            # wait until the lock is successfully acquired
            with lock.acquire(timeout=0):
                # once got lock, proceed on evaluating
                result = evaluate(request)
                logger.info(f"Finished evaluating, sending back results {result}")
                send_eval_result(result)
                logger.info("Results sent, waiting for new requests")
                ch.basic_ack(delivery_tag=method.delivery_tag)
                break
            # lock will auto-release once out of the 'with' scope
        except Timeout:
            logger.info("Lock is occupied, wait 5 seconds before retrying...")
            time.sleep(5)
```

逻辑：
- 一旦收到评估请求，尝试获取锁
- 获取锁失败：持有当前消息并等待，5 秒后重新尝试获得锁（等待期间停止消费消息）
- 获取锁成功：执行评测并释放锁，发回结果并返回 ack

---

### 5.3 与 MQ 重试机制的关系

> **blocking retry（持消息等待）**

#### 5.3.1 不建议方案（禁止）

```python
basic_nack(requeue = true)
```

原因：

* 会导致消息立即重投递
* 可能引发消费风暴（busy loop）

#### 5.3.2 另外一种可行方案（本例并未采用）

* reject + 延迟队列（DLX + TTL）

---

## 6. 稳定性保障机制

### 6.1 消息不丢失

* Python进程拿不到锁就持消息等待，不 ack 也不 nack
* MQ 采用 at-least-once delivery，如果 Python进程 在此期间挂掉，消息得以重新投递

---

### 6.2 崩溃恢复

* JVM 或 Python进程 崩溃 → OS 自动释放文件锁
* 消息重新进入队列

---

### 6.3 背压机制

系统通过以下方式实现自然背压：

* MQ prefetch = 1
* unacked message 控制 inflight 数
* TaskLock 控制 CPU 并发

---

## 7. 设计总结

TaskLock 的核心思想是：

> 在执行层做资源互斥控制。

