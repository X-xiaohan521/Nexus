package org.unimilk.backend.dto;

public record UserDetailDto(
        Integer id,
        String username,
        Integer role,
        Integer allowSubmit
) {}
