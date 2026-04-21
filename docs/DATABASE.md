# 数据库设计
## 数据表及字段
### 1. user 表
| id | username | password | role 0(user) / 1(admin) | allow_submit 0(prohibit) / 1(allow) |
| --- | ------ | ---------- | --- | --- |
| 1   | Milk   | $2a$10$...   | 1 |  1  |
| 2   | John   | $2a$10$...   | 0 |  0  |

### 2. submission 表
| id | file_uri | status 0(failed) / 1(success) / 2(pending) / 3(running) | score | err_msg | submission_time | user_id |
| --- | ------ | ------ | ---------- | ---------- | ---------- |--------- |
| 1   |  /submission/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv   | 1 | 91 |  | 2026-03-17 14:17 | 1 |
| 2   |  /submission/5a2b833c-3113-40ce-aa22-3a8ac6ccf7bd.csv   | 0 | null | csv 格式错误 | 2026-03-16 09:24 | 3 |
| 3   |  /submission/ef718657-eb25-4b5b-8263-0217e83490a0.csv   | 1 | 90 | | 2026-03-16 15:17 | 2 |
| 4   |  /submission/ef718657-eb25-4b5b-8263-0217e83490a0.csv   | 3 | null | | 2026-03-16 15:17 | 1 |

### 3. leaderboard 表
| id | rank | user_id | username | submission_id | highest_score | submission_time |
| -- | ---- | ------- | -------- | ------------- | ------------- | --------------- |
| 1  |  1   |    1    | Milk     |  1            |  91           | 2026-03-17 14:17 |
| 2  |  2   |    2    | John     |  3            |  90           | 2026-03-16 15:17 |

> [!NOTE]
> 注：leaderboard 表不包含任何额外信息，故可以删除，随时从 user 和 submission 表重建。leaderboard 表的刷新为定时任务，按照一定时间间隔自动根据上两张表生成。