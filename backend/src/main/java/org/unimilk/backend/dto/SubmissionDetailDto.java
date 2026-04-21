package org.unimilk.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public record SubmissionDetailDto(
        Integer id,
        String fileUri,
        String username,
        Integer status,
        Float score,
        String errMsg,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime submissionTime
) {}
