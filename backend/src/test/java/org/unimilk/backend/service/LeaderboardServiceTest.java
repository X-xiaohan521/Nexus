package org.unimilk.backend.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.unimilk.backend.repo.SubmissionRepo;

@SpringBootTest
class LeaderboardServiceTest {
    private final LeaderboardService leaderboardService;
    private final SubmissionRepo submissionRepo;

    @Autowired
    LeaderboardServiceTest(LeaderboardService leaderboardService, SubmissionRepo submissionRepo) {
        this.leaderboardService = leaderboardService;
        this.submissionRepo = submissionRepo;
    }

    @Test
    void testCalculateLeaderboard() {
        leaderboardService.calculateLeaderboard();
    }

    @Test
    void testCalculateEmptyLeaderboardShouldNotThrowException() {
        submissionRepo.deleteAll();
        leaderboardService.calculateLeaderboard();
    }
}