package org.unimilk.backend.response;

public record EvaluateResult(
         Integer submissionId,
         String callbackId,
         Integer status,
         Float score,
         String errorMsg
) {}
