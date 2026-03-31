package org.unimilk.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "submissions",
        uniqueConstraints = @UniqueConstraint(columnNames = {"id", "fileUri"})
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Submission {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    String fileUri;
    Integer status;
    Float score;
    String errMsg;
    LocalDateTime submissionTime;

    @ManyToOne @JoinColumn(name = "user_id")
    User user;
}
