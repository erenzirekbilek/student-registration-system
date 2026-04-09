package com.v1.backend.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class RegulationAssistantService {

    private final ChatClient chatClient;
    private final boolean isConfigured;

    public RegulationAssistantService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
        this.isConfigured = true;
    }

    public String ask(String question, String role, Map<String, Object> personalData) {
        String systemMessage = buildSystemMessage(role);
        String contextText = buildContextText(personalData);
        
        String userContent = contextText + "\n\nQuestion: " + question;

        return chatClient.prompt()
            .system(systemMessage)
            .user(userContent)
            .call()
            .content();
    }

    public boolean isAiConfigured() {
        return isConfigured;
    }

    private String buildSystemMessage(String role) {
        return switch (role) {
            case "STUDENT" -> """
                You are an AI assistant for the Student Management System.
                Adopt a GUIDANCE persona: supportive, clear, and focused on the student's personal situation.
                Always reference the relevant article number.
                After answering, guide the student to the relevant module (e.g., Absence Tracker, Exam Schedule).
                Never invent rules. Only use your general knowledge about school management.
                Keep responses concise and helpful.
                """;
            case "TEACHER" -> """
                You are an AI assistant for the Student Management System.
                Adopt an ADMINISTRATIVE SUPPORT persona: technical, procedural, and precise.
                Always reference the relevant article number.
                After answering, direct the teacher to the relevant system module (e.g., Grade Entry, Disciplinary Forms).
                Never invent rules. Only use your general knowledge about school management.
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
