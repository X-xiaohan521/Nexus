package org.unimilk.backend.response;

public record CaptchaVerifyResponse(
        String status, // 请求状态
        String result, // 二次校验结果
        String reason, // 校验结果说明
        Object captcha_args
) {}
