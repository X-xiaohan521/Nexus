package org.unimilk.backend.util;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.unimilk.backend.settings.SettingsManager;

import java.io.File;
import java.nio.file.Path;

@Slf4j
@Component
public class GtUtils {
    @Value("${app.data.directory}")
    private String dataDir;

    private final SettingsManager settingsManager;

    @Autowired
    public GtUtils(SettingsManager settingsManager) {
        this.settingsManager = settingsManager;
    }

    @PostConstruct
    public void generateGroundTruthDirOnBoot() {
        Path gtDir = Path.of(dataDir, settingsManager.getSettings().getGroundTruth());
        File groundTruth = new File(gtDir.toUri());
        if (groundTruth.exists()) {
            return;
        }
        log.warn("Missing ground truth directory {}, creating one...", gtDir);
        boolean isGtDirMade = groundTruth.mkdirs();
        if (!isGtDirMade) {
            log.error("Failed to create ground truth directory, please check your system access permission.");
        }
    }
}
