package org.unimilk.backend.conf;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MqConfig {
    @Bean
    public Queue evalRequestQueue() {
        return new Queue("mq.evaluate.request");
    }

    @Bean
    public Queue evalResultQueue() {
        return new Queue("mq.evaluate.result");
    }
}
