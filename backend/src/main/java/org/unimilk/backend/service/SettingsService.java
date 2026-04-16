package org.unimilk.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Slf4j
@Service
public class SettingsService {
    @Value("${app.data.directory}")
    private String dataDir;

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
