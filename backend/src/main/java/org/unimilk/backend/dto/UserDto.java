package org.unimilk.backend.dto;

public record UserDto(
        Integer id,
        String username,
        Integer role
) {}
