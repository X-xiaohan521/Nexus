package org.unimilk.backend.dto;

import java.time.LocalDateTime;

public record SubmissionDto(
        Integer id,
        Integer status,
        Float score,
        LocalDateTime submissionTime
) {}
