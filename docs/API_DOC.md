# API 接口文档

> [!NOTE]
> AiRankingSystem 在 `/api` 端点下提供 REST API。除登录/注册外，所有端点都需要 JWT 认证。

**后端基础 URL：** `http://your-host:6780/api`

**认证：** 将 JWT 令牌作为 `Authorization: Bearer <token>` 请求头传入。

---

## 响应
> 所有 api 响应均为统一格式
```json
{
  "code": 1,
  "message": "",
  "data": {}
}
```
* "code": 1（成功） 或 0（失败）
* "message": 成功信息 或 失败原因
* "data": 如果响应有数据，均放置在该字段

---

## 认证

### 1. 登录

```
POST /auth/login
```

使用用户名和密码进行认证。

**请求体：**
```json
{
  "username": "string",
  "password": "string"
}
```

**响应：**
* 成功
    ```json
    {
      "code": 1,
      "data": {
            "token": "<token>"
        },
      "msg": "登录成功~"
    }
    ```
* 失败
    ```json
    {
      "code": 0,
      "data": null,
      "msg": "用户名或密码无效。"
    }
    ```

---

### 2. 注册

```
POST /auth/register
```

使用用户名和密码进行注册。

**请求体：**
```json
{
  "username": "string",
  "password": "string"
  "captchaResult": {
    "lot_number": "...",
    "captcha_output": "...",
    "pass_token": "...",
    "gen_time": "..."
  }
}
```

**响应：**
* 成功
    ```json
    {
      "code": 1,
      "data": {
            "token": "<token>"
        },
      "msg": "注册成功~"
    }
    ```
* 失败
    ```json
    {
      "code": 0,
      "data": null,
      "msg": "用户名已存在。"
    }
    ```

---

### 3. 刷新令牌

```
GET /auth/refreshToken
```

刷新当前的认证令牌。

**响应：**
* 成功
    ```json
    {
      "code": 1,
      "data": {
            "token": "<newToken>"
        },
      "msg": "令牌已刷新。"
    }
    ```
* 失败
    ```json
    {
      "code": 0,
      "data": null,
      "msg": "令牌无效，请重新登录。"
    }
    ```

---

### 4. 初始化 Captcha 凭证

```
GET /auth/captcha/init
```

获取人机验证凭证。

**响应：**
* 成功
    ```json
    {
      "code": 1,
      "data": {
            "captchaId": "<极验captchaId>"
        },
      "msg": ""
    }
    ```
* 失败
    ```json
    {
      "code": 0,
      "data": null,
      "msg": "服务繁忙，请稍后再试。"
    }
    ```

---

## 用户
### 1. 获取当前用户信息

```
GET /user/me
```

根据所携带 token 返回用户信息。

**响应：**
* 成功
    ```json
    {
      "code": 1,
      "data": {
        "username": "<username>",
        "role": 0
      },
      "msg": ""
    }
    ```
* 失败
    ```json
    {
      "code": 0,
      "data": null,
      "msg": "令牌无效，请重新登录。"
    }
    ```

---

## 提交
### 1. 获取当前用户所有提交记录

```
GET /submission
```

根据所携带 token 返回用户所有提交记录（按照提交时间倒序排列）。

* 成功
    ```json
    {
      "code": 1,
      "data": [
        {"id": 3, "status": 3, "score": null, "submissionTime": "2026-03-17 14:17", "errMsg": null},
        {"id": 2, "status": 0, "score": null, "submissionTime": "2026-03-16 09:24", "errMsg": "文档格式有误"},
        {"id": 1, "status": 1, "score": 83, "submissionTime": "2026-03-15 22:30", "errMsg": null}
      ],
      "msg": ""
    }
    ```
* 失败
    ```json
    {
      "code": 0,
      "data": null,
      "msg": "令牌无效，请重新登录。"
    }
    ```

---

### 2. 上传一次提交

```
POST /submission
```

请求体格式：multipart/form-data

仅允许上传规定的 submission 文件格式。

**响应：**
* 成功
    ```json
    {
      "code": 1,
      "data": null,
      "msg": ""
    }
    ```
* 失败
    ```json
    {
      "code": 0,
      "data": null,
      "msg": "文件不符合要求，请重新提交。"
    }
    ```

---

## 排行榜
### 1. 获取当前排行榜

```
GET /leaderboard
```

获取排行榜数据，按照分数由高到低排列。

* 成功
    ```json
    {
      "code": 1,
      "data": {
        "leaderboardRefreshRate": 3600,
        "leaderboardData": [
          {"rank": 1, "username": "Milk", "score": 91, "submissionTime": "2026-03-17 14:17"},
          {"rank": 2, "username": "John", "score": 90, "submissionTime": "2026-03-16 15:17"}
        ],
      },
      "msg": ""
    }
    ```
* 失败
    ```json
    {
      "code": 0,
      "data": null,
      "msg": "你没有权限这么做。"
    }
    ```

---

## 管理接口

> [!IMPORTANT]
> 以下接口均只允许管理员访问，需携带管理员用户的 token 访问。

### 1. 获取所有提交记录

```
GET /admin/submission
```

允许携带参数：`/admin/submission?page=1&pageSize=10`

所有提交记录分页查询，按照提交时间倒序排列。

* 成功
    ```json
    {
      "code": 1,
      "data": [
        {"id": 3, "username": "John", "status": 1, "score": 81, "submissionTime": "2026-03-17 14:17", "errMsg": null},
        {"id": 2, "username": "Alice", "status": 0, "score": null, "submissionTime": "2026-03-16 09:24", "errMsg": "文档格式有误"},
        {"id": 1, "username": "Milk", "status": 2, "score": 83, "submissionTime": "2026-03-15 22:30", "errMsg": null}
      ],
      "msg": ""
    }
    ```
* 失败
    ```json
    {
      "code": 0,
      "data": null,
      "msg": "你没有权限这么做。"
    }
    ```
    
---

### 2. 获取当前配置

```
GET /admin/config
```

获取当前系统配置信息，注意这会同时使后端重新加载 `config.json`。

* 成功
    ```json
    {
      "code": 1,
      "data": {
        "leaderboardRefreshRate": 3600,   // 单位：s（秒）
        "groundTruth": "./ground_truth/A_test",   // ground_truth 路径
        "isLeaderboardEnabled": true,   // 排行榜是否开启
        "availableGroundTruths": ["./ground_truth/A_test", "./ground_truth/B_test"],   // 可用的 ground_truth 路径
        "allowRegistration": true,   // 是否允许新用户注册
        "defaultAllowSubmit": 1   // 是否默认允许新用户提交
      },
      "msg": ""
    }
    ```
* 失败
    ```json
    {
      "code": 0,
      "data": null,
      "msg": "你没有权限这么做。"
    }
    ```

---

### 3. 修改当前配置

```
PUT /admin/config
```

请求体格式：application/json

请求体：

```json
{
  "leaderboardRefreshRate": 300,
  "groundTruth": "./ground_truth/B_test",
  "isLeaderboardEnabled": true
}
```

> 可以仅传递需要修改的字段，留空的配置将不会修改。

* 成功
    ```json
    {
      "code": 1,
      "data": {
        "leaderboardRefreshRate": 300,
        "groundTruth": "./ground_truth/B_test",   
        "isLeaderboardEnabled": true
      },
      "msg": "配置保存成功~"
    }
    ```
* 失败
    ```json
    {
      "code": 0,
      "data": null,
      "msg": "你没有权限这么做。"
    }
    ```

---

### 4. 获取用户列表

```
GET /admin/users
```

获取当前系统中所有用户信息。

* 成功
    ```json
    {
      "code": 1,
      "data": [
        {"id": 1, "username": "Milk", "role": 1, "allowSubmit": 1},
        {"id": 2, "username": "John", "role": 0, "allowSubmit": 0},
        {"id": 3, "username": "Jessica", "role": 0, "allowSubmit": 1}
      ],
      "msg": ""
    }
    ```
* 失败
    ```json
    {
      "code": 0,
      "data": null,
      "msg": "你没有权限这么做。"
    }
    ```

---

### 5. 修改用户信息

```
PUT /admin/users/{$id}
```

修改 id 为 {$id} 的用户信息。

请求体：

```json
{
  "allowSubmit": 0
}
```

* 成功
    ```json
    {
      "code": 1,
      "data": null,
      "msg": "修改成功~"
    }
    ```
* 失败
    ```json
    {
      "code": 0,
      "data": null,
      "msg": "你没有权限这么做。"
    }
    ```

---

### 6. 删除用户

```
DELETE /admin/users/{$id}
```

删除 id 为 {$id} 的用户。

* 成功
    ```json
    {
      "code": 1,
      "data": null,
      "msg": "用户删除成功~"
    }
    ```
* 失败
    ```json
    {
      "code": 0,
      "data": null,
      "msg": "你没有权限这么做。"
    }
    ```
