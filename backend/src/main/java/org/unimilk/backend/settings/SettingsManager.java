package org.unimilk.backend.settings;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.unimilk.backend.exception.BusinessException;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
@Slf4j
public class SettingsManager {

    @Getter
    private Settings settings;

    @Value("${app.data.directory}")
    private String dataDir;

    private Gson gson;

    @Autowired
    public SettingsManager(Gson gson) {
        this.gson = gson;
    }

    @PostConstruct
    private void loadSettings() {
        StringBuilder sb = new StringBuilder();
        String jsonStr;
        try (BufferedReader reader = Files.newBufferedReader(Path.of(dataDir, "config.json"))) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line).append("\n");
            }
            jsonStr = sb.toString();
        } catch (IOException e) {
            this.settings = new Settings();
            log.error("Failed to load config.json, using default settings.", e);
            return;
        }
        try {
            this.settings = gson.fromJson(jsonStr, Settings.class);
            if (settings == null) {
                throw new JsonSyntaxException("Json file is empty.");
            }
        } catch (JsonSyntaxException e) {
            this.settings = new Settings();
            saveSettings();
            log.error("Config.json syntax error, overwritten with default.", e);
        }
    }

    @PreDestroy
    private void saveSettings() {
        try (BufferedWriter writer = Files.newBufferedWriter(Path.of(dataDir, "config.json"))) {
            String jsonStr = gson.toJson(this.settings);
            writer.write(jsonStr);
        } catch (IOException e) {
            log.error("Failed to save config.json, please check your system access permission.", e);
        }
    }

    public void refreshSettings() {
        loadSettings();
    }

    public void applySettingsFrom(Settings newSettings) {
        this.settings = newSettings;
    }

    public void applyAndSaveSettingsFrom(Settings newSettings) {
        this.settings = newSettings;
        saveSettings();
    }
}
