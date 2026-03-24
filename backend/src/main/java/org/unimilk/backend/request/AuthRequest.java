package org.unimilk.backend.request;

public record AuthRequest(
        String username,
        String password
) {}
