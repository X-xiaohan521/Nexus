package org.unimilk.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.unimilk.backend.dto.TokenDto;
import org.unimilk.backend.request.LoginRequest;
import org.unimilk.backend.response.UniResponse;
import org.unimilk.backend.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public UniResponse onLogin(@RequestBody LoginRequest req) {
        TokenDto tokenDto = authService.handleLogin(req.username(), req.password());
        return UniResponse.success(tokenDto, "登录成功~");
    }
}
