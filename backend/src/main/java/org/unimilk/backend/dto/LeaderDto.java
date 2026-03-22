package org.unimilk.backend.dto;

import java.time.LocalDateTime;

public record LeaderDto(
        Integer rank,
        String username,
        Integer score,
        LocalDateTime submissionTime
) {}
