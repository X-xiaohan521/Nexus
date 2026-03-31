package org.unimilk.backend.dto;

public record CaptchaResultDto(
        String lot_number,
        String captcha_output,
        String pass_token,
        String gen_time
) {}
