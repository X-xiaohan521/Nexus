package org.unimilk.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public record SubmissionLessDto(
        Integer id,
        String username,
        Integer status,
        Float score,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime submissionTime
) {}
