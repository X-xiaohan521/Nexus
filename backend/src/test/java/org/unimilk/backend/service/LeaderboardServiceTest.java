package org.unimilk.backend.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class LeaderboardServiceTest {
    private final LeaderboardService leaderboardService;

    @Autowired
    LeaderboardServiceTest(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @Test
    void testCalculateLeaderboard() {
        leaderboardService.calculateLeaderboard();
    }
}