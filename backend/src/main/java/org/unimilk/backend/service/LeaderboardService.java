package org.unimilk.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.unimilk.backend.dto.LeaderDto;
import org.unimilk.backend.dto.LeaderboardDto;
import org.unimilk.backend.entity.Leader;
import org.unimilk.backend.repo.LeaderboardRepo;
import org.unimilk.backend.settings.SettingsManager;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class LeaderboardService {
    private final SettingsManager settingsManager;
    private final LeaderboardRepo leaderboardRepo;

    @Autowired
    public LeaderboardService(SettingsManager settingsManager, LeaderboardRepo leaderboardRepo) {
        this.settingsManager = settingsManager;
        this.leaderboardRepo = leaderboardRepo;
    }

    public LeaderboardDto getLeaderboard() {
        List<Leader> leaderboard = leaderboardRepo.findAll();
        AtomicInteger rank = new AtomicInteger(1);
        List<LeaderDto> leaderboardData = leaderboard.stream()
                .sorted((leader1, leader2) -> leader2.getHighestScore().compareTo(leader1.getHighestScore()))
                .map((leader -> new LeaderDto(rank.getAndIncrement(), leader.getUsername(), leader.getHighestScore(), leader.getSubmissionTime())))
                .toList();
        Integer leaderboardRefreshRate = settingsManager.getSettings().getLeaderboardRefreshRate();
        return new LeaderboardDto(leaderboardRefreshRate, leaderboardData);
    }
}
