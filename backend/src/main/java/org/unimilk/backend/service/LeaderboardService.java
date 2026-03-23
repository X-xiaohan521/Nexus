package org.unimilk.backend.service;

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

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

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
        AtomicInteger rank = new AtomicInteger(1);
        List<LeaderDto> leaderboardData = leaderboard.stream()
                .sorted((leader1, leader2) -> leader2.getHighestScore().compareTo(leader1.getHighestScore()))
                .map((leader -> new LeaderDto(rank.getAndIncrement(), leader.getUsername(), leader.getHighestScore(), leader.getSubmissionTime())))
                .toList();
        Integer leaderboardRefreshRate = settingsManager.getSettings().getLeaderboardRefreshRate();
        return new LeaderboardDto(leaderboardRefreshRate, leaderboardData);
    }

    @Transactional
    public void calculateLeaderboard() {
        leaderboardRepo.deleteAll();
        List<User> users = userRepo.findAll();
        List<Leader> leaders = users.stream().map(user -> {
                    List<Submission> submissions = user.getSubmissions();
                    if (submissions.isEmpty()) {
                        return null;
                    }
                    List<Submission> sortedSubmissions = submissions.stream().sorted((s1, s2) -> {
                        if (s1.getScore() == null && s2.getScore() == null) {
                            return 0;
                        } else if (s1.getScore() == null) {
                            return -1;
                        } else if (s2.getScore() == null) {
                            return 1;
                        } else {
                            return s2.getScore().compareTo(s1.getScore());
                        }
                    }).toList();
                    Submission highestSubmission = sortedSubmissions.getFirst();
                    return new Leader(null, null, user.getUsername(), highestSubmission.getScore(), highestSubmission.getSubmissionTime(), user, highestSubmission);
                }).filter(leader -> leader != null && leader.getHighestScore() != null)
                .sorted((leader1, leader2) -> leader2.getHighestScore().compareTo(leader1.getHighestScore()))
                .toList();
    }
}
