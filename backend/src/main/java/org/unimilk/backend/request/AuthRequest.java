package org.unimilk.backend.request;

import org.unimilk.backend.dto.CaptchaResultDto;

public record AuthRequest(
        String username,
        String password,
        CaptchaResultDto captchaResult
) {}
