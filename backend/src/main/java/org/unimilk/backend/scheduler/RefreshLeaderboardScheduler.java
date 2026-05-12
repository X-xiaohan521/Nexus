package org.unimilk.backend.scheduler;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;
import org.unimilk.backend.lock.TaskLock;
import org.unimilk.backend.lock.TaskLockFactory;
import org.unimilk.backend.service.LeaderboardService;
import org.unimilk.backend.settings.SettingsManager;

import java.time.Duration;
import java.util.concurrent.ScheduledFuture;

@Slf4j
@Service
public class RefreshLeaderboardScheduler {
    private final ThreadPoolTaskScheduler scheduler;
    private final SettingsManager settingsManager;
    private final LeaderboardService leaderboardService;
    private final TaskLockFactory taskLockFactory;

    private ScheduledFuture<?> future;

    @Autowired
    public RefreshLeaderboardScheduler(ThreadPoolTaskScheduler scheduler, SettingsManager settingsManager, LeaderboardService leaderboardService, TaskLockFactory taskLockFactory) {
        this.scheduler = scheduler;
        this.settingsManager = settingsManager;
        this.leaderboardService = leaderboardService;
        this.taskLockFactory = taskLockFactory;
    }

    @PostConstruct
    public void startTask() {
        stopTask();
        Integer leaderboardRefreshRate = settingsManager.getSettings().getLeaderboardRefreshRate();
        log.info("Starting scheduled task: refresh leaderboard every {} s.", leaderboardRefreshRate);
        future = scheduler.scheduleAtFixedRate(() -> {
            try (TaskLock lock = taskLockFactory.tryAcquire("heavy-task")) {
                if (lock == null) {
                    log.info("Lock is occupied, skip calculating the leaderboard.");
                    return;
                }
                log.info("Running scheduled task: refreshing the leaderboard...");
                leaderboardService.calculateLeaderboard();
            }
        }, Duration.ofSeconds(leaderboardRefreshRate));
    }

    @PreDestroy
    public void stopTask() {
        if (future != null) {
            log.info("Stopping scheduled task: refresh leaderboard.");
            future.cancel(false);
        }
    }

    public void restartTask() {
        log.info("Restarting scheduled task: refresh leaderboard.");
        stopTask();
        startTask();
    }
}
