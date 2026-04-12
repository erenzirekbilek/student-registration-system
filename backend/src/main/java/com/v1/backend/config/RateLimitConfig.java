package com.v1.backend.config;

import io.github.bucket4j.Bucket;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.time.Duration;

@Configuration
public class RateLimitConfig {
    
    @Bean
    public Bucket bucket() {
        return Bucket.builder()
            .addLimit(limit -> limit.capacity(100).refillGreedy(100, Duration.ofMinutes(1)))
            .build();
    }
}