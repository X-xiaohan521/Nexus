package org.unimilk.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.unimilk.backend.dto.ConfigDto;
import org.unimilk.backend.exception.BusinessException;
import org.unimilk.backend.scheduler.RefreshLeaderboardScheduler;
import org.unimilk.backend.settings.Settings;
import org.unimilk.backend.settings.SettingsManager;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

@Slf4j
@Service
public class SettingsService {
    @Value("${app.data.directory}")
    private String dataDir;

    private final SettingsManager settingsManager;
    private final RefreshLeaderboardScheduler refreshLeaderboardScheduler;

    @Autowired
    public SettingsService(SettingsManager settingsManager, RefreshLeaderboardScheduler refreshLeaderboardScheduler) {
        this.settingsManager = settingsManager;
        this.refreshLeaderboardScheduler = refreshLeaderboardScheduler;
    }

    public ConfigDto getConfig() {
        Settings settings = settingsManager.getSettings();
        return new ConfigDto(
                settings.getLeaderboardRefreshRate(),
                settings.getGroundTruth(),
                settings.isLeaderboardEnabled(),
                getAvailableGroundTruths(),
                settings.isAllowRegistration(),
                settings.getDefaultAllowSubmit()
        );
    }

    public ConfigDto refreshAndGetConfig() {
        Settings oldSettings = settingsManager.getSettings();
        settingsManager.refreshSettings();
        if (!Objects.equals(oldSettings.getLeaderboardRefreshRate(), settingsManager.getSettings().getLeaderboardRefreshRate())) {
            refreshLeaderboardScheduler.restartTask();
        }
        return getConfig();
    }

    public void updateSettings(ConfigDto newConfig) {
        // 0. validate new config
        validateConfig(newConfig);

        // 1. generate newSettings via comparing newConfig and oldSettings for updated fields
        Settings settings = settingsManager.getSettings();
        Settings newSettings = getNewSettings(newConfig, settings);

        // 2. judge whether to restart scheduler
        boolean needRestartRefreshLeaderboardScheduler = !Objects.equals(
                newSettings.getLeaderboardRefreshRate(),
                settings.getLeaderboardRefreshRate()
        );
        settingsManager.applyAndSaveSettingsFrom(newSettings);
        if (needRestartRefreshLeaderboardScheduler) {
            refreshLeaderboardScheduler.restartTask();
        }
    }

    private void validateConfig(ConfigDto config) {
        if (config.leaderboardRefreshRate() != null) {
            if (!(config.leaderboardRefreshRate() > 0)) {
                throw new BusinessException("刷新率必须为正整数。", "Failed to validate config: leaderboardRefreshRate must be a positive integer.");
            } else if (!(config.leaderboardRefreshRate() < 604800)) {
                throw new BusinessException("刷新率最低为 7 天。", "Failed to validate config: leaderboardRefreshRate cannot be lower than 7 days.");
            }
        }
        if (!(config.defaultAllowSubmit() == null || Objects.equals(config.defaultAllowSubmit(), 0) || Objects.equals(config.defaultAllowSubmit(), 1))) {
            throw new BusinessException("默认允许提交值只能为 0 或 1。", "Failed to validate config: defaultAllowSubmit can only be 0 or 1.");
        }
    }

    private static @NonNull Settings getNewSettings(ConfigDto newConfig, Settings settings) {
        Settings newSettings = new Settings();
        newSettings.setGroundTruth((newConfig.groundTruth() != null) ? newConfig.groundTruth() : settings.getGroundTruth());
        newSettings.setLeaderboardEnabled((newConfig.isLeaderboardEnabled() != null) ? newConfig.isLeaderboardEnabled() : settings.isLeaderboardEnabled());
        newSettings.setLeaderboardRefreshRate((newConfig.leaderboardRefreshRate() != null) ? newConfig.leaderboardRefreshRate() : settings.getLeaderboardRefreshRate());
        newSettings.setAllowRegistration((newConfig.allowRegistration() != null) ? newConfig.allowRegistration() : settings.isAllowRegistration());
        newSettings.setDefaultAllowSubmit((newConfig.defaultAllowSubmit() != null) ? newConfig.defaultAllowSubmit() : settings.getDefaultAllowSubmit());
        return newSettings;
    }

    public List<String> getAvailableGroundTruths() {
        // 1. get gtPath
        Path gtPath = Path.of(dataDir, "ground_truth");

        // 2. scan ground_truth directory for all children
        List<String> children;
        try (Stream<Path> s = Files.list(gtPath)) {
            // 3. only get directories
            children = s
                    .filter(Files::isDirectory)
                    .map(p -> "./ground_truth/" + p.getFileName().toString())
                    .toList();
        } catch (IOException e) {
            log.error("Failed to open and scan ground_truth directory \"{}\", returning empty list.", gtPath);
            return new ArrayList<>();
        }

        return children;
    }

}
