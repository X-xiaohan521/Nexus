package org.unimilk.backend.service;

import com.google.gson.Gson;
import jakarta.annotation.Nullable;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.HmacAlgorithms;
import org.apache.commons.codec.digest.HmacUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.unimilk.backend.dto.CaptchaResultDto;
import org.unimilk.backend.dto.TokenDto;
import org.unimilk.backend.dto.TokenBearer;
import org.unimilk.backend.dto.UserDto;
import org.unimilk.backend.entity.User;
import org.unimilk.backend.exception.BusinessException;
import org.unimilk.backend.repo.UserRepo;
import org.unimilk.backend.response.CaptchaVerifyResponse;
import org.unimilk.backend.util.JwtUtils;

import java.util.ArrayList;
import java.util.regex.Pattern;

@Slf4j
@Service
public class AuthService {
    private final UserRepo userRepo;
    private final JwtUtils jwtUtils;
    private final Gson gson;
    private final BCryptPasswordEncoder passwordEncoder;

    @Value("${app.captcha.id}")
    private String captchaId;

    @Value("${app.captcha.key}")
    private String captchaKey;

    @Autowired
    public AuthService(UserRepo userRepo, JwtUtils jwtUtils, Gson gson, BCryptPasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.jwtUtils = jwtUtils;
        this.gson = gson;
        this.passwordEncoder = passwordEncoder;
    }

    public TokenDto handleLogin(String username, String password) {
        // 1. validate username and password
        validateUsername(username);
        validatePassword(password);

        // 2. query database to find the user
        User user = userRepo.findByUsername(username).orElseThrow(() -> new BusinessException("用户不存在，请检查用户名是否有误。", "User " + username + " login failed: User not found."));

        // 3. check password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BusinessException("密码错误，请重新输入。", "User " + user.getUsername() + " login failed: password incorrect.");
        }

        // 4. generate token
        try {
            log.info("User {} login success.", user.getUsername());
            String token = jwtUtils.generateToken(user.getId(), user.getUsername());
            return new TokenDto(token);
        } catch (Exception e) {
            throw new BusinessException("服务器异常，请联系管理员。", "User " + username + " login failed: unable to generate token.", e);
        }
    }

    @Transactional
    public TokenDto handleRegister(String username, String password) {
        // 1. validate username and password
        validateUsername(username);
        validatePassword(password);

        // 2. check if username already exists
        if (userRepo.findByUsername(username).isPresent()) {
            throw new BusinessException("用户名已存在。", "User " + username + " register failed: username already exists.");
        }

        // 3. encrypt password
        String encryptedPassword = passwordEncoder.encode(password);

        // 4. store the new user to database
        User user = new User(null, username, encryptedPassword, 0, new ArrayList<>());
        try {
            user = userRepo.save(user);
        } catch (Exception e) {
            throw new BusinessException("服务器异常，请联系管理员。", "User " + username + " register failed: unable to save user.");
        }

        // 5. generate token
        try {
            log.info("User {} register success.", user.getUsername());
            String token = jwtUtils.generateToken(user.getId(), user.getUsername());
            return new TokenDto(token);
        } catch (Exception e) {
            throw new BusinessException("服务器异常，请联系管理员。", "User " + username + " register failed: unable to generate token.", e);
        }
    }

    private void validateUsername(String username) {
        if (username == null || username.isEmpty()) {
            throw new BusinessException("用户名不能为空。", "Login service is accessed with an empty username, frontend may be cracked.");
        } else if (username.length() < 3) {
            throw new BusinessException("用户名太短，需至少 3 个字符。", "Login service is accessed with a short username " + username + ", frontend may be cracked.");
        } else if (username.length() > 20) {
            throw new BusinessException("用户名太长，至多 20 个字符。", "Login service is accessed with a long username " + username + ", frontend may be cracked.");
        } else if (!Pattern.matches("^[\\u4e00-\\u9fa5a-zA-Z0-9@._-]+$", username)) {
            throw new BusinessException("用户名中包含不合法字符。", "Login service is accessed with a illegal username, frontend may be cracked.");
        }
    }

    private void validatePassword(String password) {
        if (password == null || password.isEmpty()) {
            throw new BusinessException("密码不能为空。", "Login service is accessed with an empty password, frontend may be cracked.");
        } else if (password.length() < 6) {
            throw new BusinessException("密码太短，需至少 6 个字符。", "Login service is accessed with a short password, frontend may be cracked.");
        } else if (password.length() > 20) {
            throw new BusinessException("密码太长，至多 20 个字符。", "Login service is accessed with a long password, frontend may be cracked.");
        } else if (!Pattern.matches("^[a-zA-Z0-9@._-]+$", password)) {
            throw new BusinessException("密码中包含不合法字符。", "Login service is accessed with a illegal password, frontend may be cracked.");
        }
    }

    /**
     * Verify a token.
     * @param token the token to be verified
     * @return the UserDto of the token bearer if the token is valid, otherwise null
     */
    @Nullable
    public UserDto verifyToken(String token) {
        try {
            TokenBearer bearer = jwtUtils.extractTokenBearer(token);
            User user = userRepo.findById(bearer.id()).orElseThrow();
            return new UserDto(user.getId(), user.getUsername(), user.getRole());
        } catch (Exception e) {
            return null;
        }
    }

    public void verifyCaptcha(CaptchaResultDto captchaResult) {
        String signToken = new HmacUtils(HmacAlgorithms.HMAC_SHA_256, captchaKey).hmacHex(captchaResult.lot_number());

        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        queryParams.add("lot_number", captchaResult.lot_number());
        queryParams.add("captcha_output", captchaResult.captcha_output());
        queryParams.add("pass_token", captchaResult.pass_token());
        queryParams.add("gen_time", captchaResult.gen_time());
        queryParams.add("sign_token", signToken);

        String url = String.format("https://gcaptcha4.geetest.com" + "/validate" + "?captcha_id=%s", captchaId);
        RestTemplate client = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        HttpMethod method = HttpMethod.POST;
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        try {
            HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(queryParams, headers);
            ResponseEntity<String> response = client.exchange(url, method, requestEntity, String.class);
            String resBody = response.getBody();
            CaptchaVerifyResponse verifyResponse = gson.fromJson(resBody, CaptchaVerifyResponse.class);
            assert verifyResponse != null;
            if (!("success".equals(verifyResponse.status()) && "success".equals(verifyResponse.result()))) {
                throw new RuntimeException("Captcha verification failed.");
            }
        } catch (Exception e){
            throw new BusinessException("验证码校验失败，请刷新页面后重试。", "Captcha verification failed, please check GeeTest service.", e);
        }
    }
}
