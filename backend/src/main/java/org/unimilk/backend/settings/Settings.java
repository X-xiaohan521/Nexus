package org.unimilk.backend.settings;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class Settings {
    private Integer leaderboardRefreshRate = 3600;
    private String correctAnswer = "correct_answer.csv";
    private boolean isLeaderboardEnabled = true;
}
