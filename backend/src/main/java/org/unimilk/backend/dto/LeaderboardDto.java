package org.unimilk.backend.dto;

import java.util.List;

public record LeaderboardDto(
        Integer leaderboardRefreshRate,
        List<LeaderDto> leaderboardData
) {}
