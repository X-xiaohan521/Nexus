package org.unimilk.backend.settings;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class TestSettingsManager {
    private final SettingsManager settingsManager;

    @Value("${app.data.directory}")
    private String dataDir;

    @Autowired
    public TestSettingsManager(SettingsManager settingsManager) {
        this.settingsManager = settingsManager;
    }

    @Test
    void loadingEmptyConfigFileShouldBeDefault() {
        try (BufferedWriter writer = Files.newBufferedWriter(Path.of(dataDir, "config.json"))) {
            writer.write("");
        } catch (IOException e) {
            throw new RuntimeException("Open config.json failed.", e);
        }
        settingsManager.refreshSettings();
        Settings settings = settingsManager.getSettings();
        assertEquals(new Settings(), settings);
    }

    @Test
    void loadingConfigFileWithMissingFieldShouldBeDefault() {
        try (BufferedWriter writer = Files.newBufferedWriter(Path.of(dataDir, "config.json"))) {
            writer.write("{\"leaderboardRefreshRate\":3600,}");
        } catch (IOException e) {
            throw new RuntimeException("Open config.json failed.", e);
        }
        settingsManager.refreshSettings();
        Settings settings = settingsManager.getSettings();
        assertEquals(new Settings(), settings);
    }

    @Test
    void loadingBrokenConfigFileShouldBeDefault() {
        try (BufferedWriter writer = Files.newBufferedWriter(Path.of(dataDir, "config.json"))) {
            writer.write("\"leaderboardRefreshRate\":3600,{something wrong with, it");
        } catch (IOException e) {
            throw new RuntimeException("Open config.json failed.", e);
        }
        settingsManager.refreshSettings();
        Settings settings = settingsManager.getSettings();
        assertEquals(new Settings(), settings);
    }

    @Test
    void testApplyingCustomSettings() {
        Settings settings = new Settings();
        settings.setLeaderboardEnabled(false);
        settings.setLeaderboardRefreshRate(30);
        settingsManager.applySettingsFrom(settings);
        Settings newSettings = settingsManager.getSettings();
        assertEquals(settings, newSettings);
    }

    @Test
    void testSavingAndLoadingCustomSettings() {
        Settings settings = new Settings();
        settings.setLeaderboardRefreshRate(8000);
        settings.setGroundTruth("another_correct_answer.csv");
        settingsManager.applyAndSaveSettingsFrom(settings);
        Settings newSettings = settingsManager.getSettings();
        assertEquals(settings, newSettings);
    }
}
