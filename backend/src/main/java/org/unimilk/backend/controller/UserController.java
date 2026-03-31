package org.unimilk.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.unimilk.backend.dto.MeDto;
import org.unimilk.backend.exception.BusinessException;
import org.unimilk.backend.response.UniResponse;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @GetMapping("/me")
    public UniResponse getMe(HttpServletRequest req) {
        try {
            MeDto meDto = new MeDto((String) req.getAttribute("username"), (Integer) req.getAttribute("role"));
            return UniResponse.success(meDto);
        } catch (Exception e) {
            throw new BusinessException("服务器异常，请联系管理员。", "Failed to create meDto.", e);
        }
    }
}
