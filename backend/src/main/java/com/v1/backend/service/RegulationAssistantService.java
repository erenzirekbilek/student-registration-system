package com.v1.backend.service;

import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class RegulationAssistantService {

    public String ask(String question, String role, Map<String, Object> personalData) {
        String systemMessage = buildSystemMessage(role);
        String contextText = buildContextText(personalData);
        
        // Placeholder - AI will work when Groq API key is set
        return "AI Assistant ready.\n\n" +
               "System: " + systemMessage + "\n\n" +
               "Your Data: " + contextText + "\n\n" +
               "Question: " + question + "\n\n" +
               "Configure GROQ_API_KEY to enable AI responses.";
    }

    private String buildSystemMessage(String role) {
        return switch (role) {
            case "STUDENT" -> "Guidance persona - supportive, helpful for student questions";
            case "TEACHER" -> "Admin Support persona - technical, procedural guidance";
            default -> "Helpful assistant";
        };
    }

    private String buildContextText(Map<String, Object> personalData) {
        if (personalData == null || personalData.isEmpty()) {
            return "No personal data available";
        }
        
        StringBuilder sb = new StringBuilder();
        personalData.forEach((key, value) -> sb.append(key).append(": ").append(value).append(", "));
        return sb.toString();
    }
}
