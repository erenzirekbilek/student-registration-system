package com.v1.backend.service;

import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class RegulationAssistantService {

    public String ask(String question, String role, Map<String, Object> personalData) {
        String systemMessage = buildSystemMessage(role);
        String contextText = buildContextText(personalData);
        
        // TODO: Integrate with Groq API when key is configured
        // For now, return a simple response
        return "AI Assistant is being configured. " +
               "Question: " + question + " | " +
               "Role: " + role + " | " +
               "Personal Data: " + contextText;
    }

    private String buildSystemMessage(String role) {
        return switch (role) {
            case "STUDENT" -> "Guidance persona";
            case "TEACHER" -> "Administrative Support persona";
            default -> "Helpful assistant";
        };
    }

    private String buildContextText(Map<String, Object> personalData) {
        if (personalData == null || personalData.isEmpty()) {
            return "No personal data available.";
        }
        
        StringBuilder sb = new StringBuilder();
        personalData.forEach((key, value) -> sb.append(key).append(": ").append(value).append(", "));
        return sb.toString();
    }
}
