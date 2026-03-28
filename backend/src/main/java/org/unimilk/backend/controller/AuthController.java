package org.unimilk.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.unimilk.backend.dto.TokenDto;
import org.unimilk.backend.request.AuthRequest;
import org.unimilk.backend.response.UniResponse;
import org.unimilk.backend.service.AuthService;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    @Value("${app.captcha.id}")
    private String captchaId;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public UniResponse onLogin(@RequestBody AuthRequest req) {
        TokenDto tokenDto = authService.handleLogin(req.username(), req.password());
        return UniResponse.success(tokenDto, "登录成功~");
    }

    @PostMapping("/register")
    public UniResponse onRegister(@RequestBody AuthRequest req) throws InterruptedException {
        Thread.sleep(200);
        TokenDto tokenDto = authService.handleRegister(req.username(), req.password());
        return UniResponse.success(tokenDto, "注册成功~");
    }

    @GetMapping("/captcha/init")
    public UniResponse initCaptcha() {
        return UniResponse.success(Map.of("captchaId", captchaId));
    }
}
