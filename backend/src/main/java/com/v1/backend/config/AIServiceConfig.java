package com.v1.backend.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AIServiceConfig {

    @Value("${spring.ai.openai.api-key:}")
    private String apiKey;

    @Value("${spring.ai.openai.base-url:https://api.groq.com/openai/v1}")
    private String baseUrl;

    @Bean
    public OpenAiChatModel chatModel() {
        return OpenAiChatModel.builder()
            .apiKey(apiKey)
            .baseUrl(baseUrl)
            .model("llama3-70b-8192")
            .temperature(0.3)
            .maxTokens(2048)
            .build();
    }

    @Bean
    public ChatClient chatClient(OpenAiChatModel chatModel) {
        return ChatClient.builder(chatModel).build();
    }
}
