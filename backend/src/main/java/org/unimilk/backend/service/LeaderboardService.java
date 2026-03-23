package org.unimilk.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.unimilk.backend.dto.LeaderDto;
import org.unimilk.backend.dto.LeaderboardDto;
import org.unimilk.backend.entity.Leader;
import org.unimilk.backend.entity.Submission;
import org.unimilk.backend.entity.User;
import org.unimilk.backend.repo.LeaderboardRepo;
import org.unimilk.backend.repo.SubmissionRepo;
import org.unimilk.backend.repo.UserRepo;
import org.unimilk.backend.settings.SettingsManager;

import java.util.Comparator;
import java.util.List;

@Slf4j
@Service
public class LeaderboardService {
    private final SettingsManager settingsManager;
    private final LeaderboardRepo leaderboardRepo;
    private final UserRepo userRepo;
    private final SubmissionRepo submissionRepo;

    @Autowired
    public LeaderboardService(SettingsManager settingsManager, LeaderboardRepo leaderboardRepo, UserRepo userRepo, SubmissionRepo submissionRepo) {
        this.settingsManager = settingsManager;
        this.leaderboardRepo = leaderboardRepo;
        this.userRepo = userRepo;
        this.submissionRepo = submissionRepo;
    }

    public LeaderboardDto getLeaderboard() {
        List<Leader> leaderboard = leaderboardRepo.findAll();
        List<LeaderDto> leaderboardData = leaderboard.stream()
                .sorted(Comparator.comparing(Leader::getRank))
                .map(leader -> new LeaderDto(leader.getRank(), leader.getUsername(), leader.getHighestScore(), leader.getSubmissionTime()))
                .toList();
        Integer leaderboardRefreshRate = settingsManager.getSettings().getLeaderboardRefreshRate();
        return new LeaderboardDto(leaderboardRefreshRate, leaderboardData);
    }

    @Transactional
    public void calculateLeaderboard() {
        leaderboardRepo.deleteAll();
        List<User> users = userRepo.findAll();
        List<Leader> leaders = users.stream().map(user -> {
                    List<Submission> submissions = submissionRepo.findByUserOrderByScoreDesc(user);
                    if (submissions.isEmpty()) {
                        return null;
                    }
                    Submission highestSubmission = submissions.getFirst();
                    return new Leader(null, null, user.getUsername(), highestSubmission.getScore(), highestSubmission.getSubmissionTime(), user.getId(), highestSubmission.getId());
                }).filter(leader -> leader != null && leader.getHighestScore() != null)
                .sorted((leader1, leader2) -> leader2.getHighestScore().compareTo(leader1.getHighestScore()))
                .toList();
        int rank = 1;
        leaders.getFirst().setRank(rank);
        for (int i = 1; i < leaders.size(); i++) {
            if (!leaders.get(i).getHighestScore().equals(leaders.get(i - 1).getHighestScore())) {
                rank = i + 1;
            }
            leaders.get(i).setRank(rank);
        }
        leaderboardRepo.saveAll(leaders);
    }
}
