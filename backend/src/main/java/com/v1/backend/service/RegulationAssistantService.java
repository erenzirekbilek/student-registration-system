package com.v1.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class RegulationAssistantService {

    @Value("${groq.api.key:}")
    private String groqApiKey;

    private final String model = "qwen/qwen3-32b";
    private final String baseUrl = "https://api.groq.com/openai/v1/chat/completions";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @PostConstruct
    public void validateConfig() {
        if (groqApiKey == null || groqApiKey.isBlank() || groqApiKey.startsWith("${")) {
            log.warn("Groq API key not configured — AI assistant will return placeholder responses.");
        }
    }

    public String ask(String question, String role, Map<String, Object> personalData) {

        if (groqApiKey == null || groqApiKey.isBlank() || groqApiKey.startsWith("${")) {
            return getPlaceholderResponse(question);
        }

        try {
            String systemPrompt = buildSystemMessage(role);
            String userMessage = buildContextText(personalData) + "\n\nQuestion: " + question;

            ObjectNode requestBody = objectMapper.createObjectNode();
            requestBody.put("model", model);
            requestBody.put("temperature", 0.3);
            requestBody.put("max_tokens", 2048);

            ArrayNode messages = requestBody.putArray("messages");
            messages.addObject().put("role", "system").put("content", systemPrompt);
            messages.addObject().put("role", "user").put("content", userMessage);

            String requestBodyJson = objectMapper.writeValueAsString(requestBody);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + groqApiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(requestBodyJson, headers);

            ResponseEntity<String> response =
                    restTemplate.postForEntity(baseUrl, entity, String.class);

            return objectMapper.readTree(response.getBody())
                    .path("choices").get(0)
                    .path("message")
                    .path("content")
                    .asText();

        } catch (Exception e) {
            log.error("Failed to call Groq API", e);
            return "The AI assistant is temporarily unavailable. Please try again later.";
        }
    }

    private String getPlaceholderResponse(String question) {
        return "AI Assistant is not configured.\n\n" +
                "Question received: " + question + "\n\n" +
                "To enable AI, set the GROQ_API_KEY.";
    }

    private String buildSystemMessage(String role) {
        return switch (role) {
            case "STUDENT" -> """
                You are an AI assistant for the Student Management System.
                Adopt a GUIDANCE persona: supportive, clear, and focused.
                Keep responses concise and helpful.
                """;
            case "TEACHER" -> """
                You are an AI assistant for the Student Management System.
                Adopt an ADMINISTRATIVE SUPPORT persona: precise and actionable.
                """;
            default -> "You are a helpful assistant.";
        };
    }

    private String buildContextText(Map<String, Object> personalData) {
        if (personalData == null || personalData.isEmpty()) {
            return "No personal data available.";
        }

        StringBuilder sb = new StringBuilder("[PERSONAL DATA]\n");
        personalData.forEach((k, v) -> sb.append(k).append(": ").append(v).append("\n"));
        return sb.toString();
    }
}