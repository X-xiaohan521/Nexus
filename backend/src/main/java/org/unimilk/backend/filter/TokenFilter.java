package org.unimilk.backend.filter;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.unimilk.backend.dto.UserDto;
import org.unimilk.backend.service.AuthService;

import java.io.IOException;

@Slf4j
@Component
@WebFilter(urlPatterns = "/*")
public class TokenFilter implements Filter {
    private final AuthService authService;

    @Autowired
    public TokenFilter(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        Filter.super.init(filterConfig);
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) servletRequest;
        HttpServletResponse resp = (HttpServletResponse) servletResponse;

        String requestURI = req.getRequestURI();

        if (isPublicPath(requestURI)) {
            log.info("Access public uri: allowed pass.");
            filterChain.doFilter(req, resp);
            return;
        }

        String authHeader = req.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("Missing or invalid Authorization header: prohibited.");
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String token = authHeader.substring(7);

        if (token.isEmpty()) {
            log.warn("Token is empty: prohibited.");
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        UserDto userDto = authService.verifyToken(token);

        if (userDto == null || userDto.username() == null || userDto.username().isEmpty()) {
            log.warn("Token invalid: prohibited.");
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        if (isAdminPath(requestURI) && userDto.role() != 1) {
            log.warn("User {} access admin page without an admin privilege: prohibited.", userDto.username());
        }

        log.info("User {} access restricted uri with a valid token: allowed pass.", userDto.username());
        req.setAttribute("id", userDto.id());
        req.setAttribute("username", userDto.username());
        req.setAttribute("role", userDto.role());

        filterChain.doFilter(req, resp);
    }

    @Override
    public void destroy() {
        Filter.super.destroy();
    }

    private boolean isPublicPath(String path) {
        return path.equals("/api/auth/login") || path.equals("/api/auth/register") || path.equals("/api/leaderboard");
    }

    private boolean isAdminPath(String path) {
        return path.startsWith("/api/admin");
    }
}
