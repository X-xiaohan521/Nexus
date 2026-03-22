package org.unimilk.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "leaderboard",
        uniqueConstraints = @UniqueConstraint(columnNames = {"id", "username"})
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Leader {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    String username;
    Integer highestScore;
    LocalDateTime submissionTime;

    @OneToOne
    User user;

    @OneToOne
    Submission submission;
}
