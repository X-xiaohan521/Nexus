package org.unimilk.backend.mq;

import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.unimilk.backend.response.EvaluateResult;
import org.unimilk.backend.service.SubmissionService;

@Slf4j
@Service
public class EvalResultConsumer {
    private final Gson gson;
    private final SubmissionService submissionService;

    @Autowired
    public EvalResultConsumer(Gson gson, SubmissionService submissionService) {
        this.gson = gson;
        this.submissionService = submissionService;
    }

    @RabbitListener(queues = {"${app.mq.result}"})
    public void consumeEvalResult(String msg) {
        log.info("Got result from evaluator: {}", msg);
        EvaluateResult result = gson.fromJson(msg, EvaluateResult.class);
        submissionService.onFinishEvaluating(result);
    }
}
