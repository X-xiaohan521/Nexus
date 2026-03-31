package org.unimilk.backend.request;

public record EvaluateRequest(
        Integer submissionId,
        String fileUri,
        String groundTruthUri,
        String callbackId,
        Long timestamp
) {}
