package org.unimilk.backend.request;

public record LoginRequest(
        String username,
        String password
) {}
