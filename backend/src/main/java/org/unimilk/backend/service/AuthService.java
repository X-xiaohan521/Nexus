package org.unimilk.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.unimilk.backend.dto.TokenDto;
import org.unimilk.backend.entity.User;
import org.unimilk.backend.exception.BusinessException;
import org.unimilk.backend.repo.UserRepo;
import org.unimilk.backend.util.JwtUtils;

import java.util.regex.Pattern;

@Service
public class AuthService {
    private final UserRepo userRepo;
    private final JwtUtils jwtUtils;

    @Autowired
    public AuthService(UserRepo userRepo, JwtUtils jwtUtils) {
        this.userRepo = userRepo;
        this.jwtUtils = jwtUtils;
    }

    public TokenDto handleLogin(String username, String password) {
        // 1. validate username and password
        if (username == null || username.isEmpty()) {
            throw new BusinessException("用户名不能为空。", "Login service is accessed with an empty username, frontend may be cracked.");
        } else if (username.length() < 3) {
            throw new BusinessException("用户名太短，需至少 3 个字符。", "Login service is accessed with a short username " + username + ", frontend may be cracked.");
        } else if (username.length() > 20) {
            throw new BusinessException("用户名太长，至多 20 个字符。", "Login service is accessed with a long username " + username + ", frontend may be cracked.");
        } else if (!Pattern.matches("^[\\u4e00-\\u9fa5a-zA-Z0-9@._-]+$", username)) {
            throw new BusinessException("用户名中包含不合法字符。", "Login service is accessed with a illegal username, frontend may be cracked.");
        }

        if (password == null || password.isEmpty()) {
            throw new BusinessException("密码不能为空。", "Login service is accessed with an empty password, frontend may be cracked.");
        } else if (password.length() < 6) {
            throw new BusinessException("密码太短，需至少 6 个字符。", "Login service is accessed with a short password, frontend may be cracked.");
        } else if (password.length() > 20) {
            throw new BusinessException("密码太长，至多 20 个字符。", "Login service is accessed with a long password, frontend may be cracked.");
        } else if (!Pattern.matches("^[a-zA-Z0-9@._-]+$", password)) {
            throw new BusinessException("密码中包含不合法字符。", "Login service is accessed with a illegal password, frontend may be cracked.");
        }

        // 2. query database to find the user
        User user = userRepo.findByUsername(username).orElseThrow(() -> new BusinessException("用户不存在，请检查用户名是否有误。", "User " + username + " login failed: User not found."));

        // 3. check password
        if (!password.equals(user.getPassword())) {
            throw new BusinessException("密码错误，请重新输入。", "User " + username + " login failed: password incorrect.");
        }

        // 4. generate token
        try {
            String token = jwtUtils.generateToken(user.getId(), user.getUsername());
            return new TokenDto(token);
        } catch (Exception e) {
            throw new BusinessException("服务器内部错误，请联系管理员。", "User " + username + " login failed: unable to generate token.", e);
        }
    }
}
