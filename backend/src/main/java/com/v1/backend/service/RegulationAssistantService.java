package com.v1.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class RegulationAssistantService {

    @Value("${groq.api.key:}")
    private String groqApiKey;

    private final String model = "llama3-70b-8192";
    private final String baseUrl = "https://api.groq.com/openai/v1/chat/completions";
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String ask(String question, String role, Map<String, Object> personalData) {
        if (groqApiKey == null || groqApiKey.isEmpty() || groqApiKey.startsWith("${")) {
            return getPlaceholderResponse(question, role, personalData);
        }

        try {
            String systemPrompt = buildSystemMessage(role);
            String contextText = buildContextText(personalData);

            String userMessage = contextText + "\n\nQuestion: " + question;

            String requestBody = String.format("""
                {
                    "model": "%s",
                    "messages": [
                        {"role": "system", "content": "%s"},
                        {"role": "user", "content": "%s"}
                    ],
                    "temperature": 0.3,
                    "max_tokens": 2048
                }
                """, model, systemPrompt.replace("\"", "\\\"").replace("\n", "\\n"), 
                userMessage.replace("\"", "\\\"").replace("\n", "\\n"));

            RestTemplate restTemplate = new RestTemplate();
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("Authorization", "Bearer " + groqApiKey);
            headers.set("Content-Type", "application/json");

            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(requestBody, headers);
            
            String response = restTemplate.postForObject(baseUrl, entity, String.class);
            
            JsonNode jsonNode = objectMapper.readTree(response);
            return jsonNode.path("choices").get(0).path("message").path("content").asText();

        } catch (Exception e) {
            return "Error connecting to AI service: " + e.getMessage() + "\n\n" +
                   getPlaceholderResponse(question, role, personalData);
        }
    }

    private String getPlaceholderResponse(String question, String role, Map<String, Object> personalData) {
        return "AI Assistant is configured but needs a valid API key.\n\n" +
               "Question: " + question + "\n\n" +
               "To enable AI, add your Groq API key to application.properties:\n" +
               "groq.api.key=your_api_key_here";
    }

    private String buildSystemMessage(String role) {
        return switch (role) {
            case "STUDENT" -> """
                You are an AI assistant for the Student Management System.
                Adopt a GUIDANCE persona: supportive, clear, and focused on the student's personal situation.
                Keep responses concise and helpful.
                """;
            case "TEACHER" -> """
                You are an AI assistant for the Student Management System.
                Adopt an ADMINISTRATIVE SUPPORT persona: technical, procedural, and precise.
                Keep responses concise and actionable.
                """;
            default -> "You are a helpful assistant for a student management system.";
        };
    }

    private String buildContextText(Map<String, Object> personalData) {
        if (personalData == null || personalData.isEmpty()) {
            return "No personal data available.";
        }
        
        StringBuilder sb = new StringBuilder("[PERSONAL DATA]\n");
        personalData.forEach((key, value) -> sb.append(key).append(": ").append(value).append("\n"));
        return sb.toString();
    }
}
