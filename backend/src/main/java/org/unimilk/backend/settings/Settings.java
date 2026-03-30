package org.unimilk.backend.settings;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class Settings {
    private Integer leaderboardRefreshRate = 3600;
    private String groundTruth = "./data/ground_truth";
    private boolean isLeaderboardEnabled = true;
}
