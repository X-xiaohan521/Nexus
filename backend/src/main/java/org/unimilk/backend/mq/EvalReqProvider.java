package org.unimilk.backend.mq;

import com.google.gson.Gson;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.unimilk.backend.request.EvaluateRequest;

@Service
public class EvalReqProvider {
    private final RabbitTemplate template;
    private final Gson gson;

    @Value("${app.mq.request}")
    private String reqQueue;

    @Autowired
    public EvalReqProvider(RabbitTemplate template, Gson gson) {
        this.template = template;
        this.gson = gson;
    }

    public void sendEvalReq(EvaluateRequest evalReq) {
        String msg = gson.toJson(evalReq);
        template.convertAndSend(reqQueue, msg);
    }
}
