package org.unimilk.backend.response;

public record EvaluateResponse(
         Integer submissionId,
         String callbackId,
         Integer status,
         Float score,
         String errorMsg
) {}
