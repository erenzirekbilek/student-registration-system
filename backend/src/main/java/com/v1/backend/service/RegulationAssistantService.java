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

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
    private final RegulationService regulationService;
    private final AcademicCalendarService calendarService;
    private final ExamScheduleService examService;

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
            String userMessage = buildContextText(personalData) 
                + "\n\n[REGULATIONS]\n" + getRegulationsContext() 
                + "\n\n[ACADEMIC CALENDAR]\n" + getCalendarContext()
                + "\n\n[EXAM SCHEDULE]\n" + getExamContext()
                + "\n\nQuestion: " + question;

            ObjectNode requestBody = objectMapper.createObjectNode();
            requestBody.put("model", model);
            requestBody.put("temperature", 0.1);
            requestBody.put("top_p", 0.5);
            requestBody.put("max_tokens", 1024);

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

    private String getRegulationsContext() {
        try {
            List<Map<String, Object>> regulations = regulationService.getAllRegulationsAsMap();
            if (regulations == null || regulations.isEmpty()) {
                return "No school regulations available.";
            }
            return regulations.stream()
                    .map(r -> String.format("Article %s [%s]: %s - %s",
                            r.get("articleNumber"),
                            r.get("category"),
                            r.get("title"),
                            r.get("content")))
                    .collect(Collectors.joining("\n"));
        } catch (Exception e) {
            log.warn("Could not fetch regulations", e);
            return "No school regulations available.";
        }
    }

    private String getCalendarContext() {
        try {
            List<Map<String, Object>> events = calendarService.getAllEventsAsMap();
            if (events == null || events.isEmpty()) {
                return "No upcoming events in the academic calendar.";
            }
            return events.stream()
                    .map(e -> String.format("%s: %s (%s) %s",
                            e.get("eventType"),
                            e.get("title"),
                            e.get("startDate"),
                            e.get("description") != null ? "- " + e.get("description") : ""))
                    .collect(Collectors.joining("\n"));
        } catch (Exception e) {
            log.warn("Could not fetch calendar", e);
            return "No calendar events available.";
        }
    }

    private String getExamContext() {
        try {
            List<Map<String, Object>> exams = examService.getAllExamsAsMap();
            if (exams == null || exams.isEmpty()) {
                return "No exams scheduled.";
            }
            return exams.stream()
                    .map(ex -> String.format("%s - %s (%s %s-%s, Room: %s)",
                            ex.get("examType"),
                            ex.get("courseName"),
                            ex.get("examDate"),
                            ex.get("startTime"),
                            ex.get("endTime"),
                            ex.get("room")))
                    .collect(Collectors.joining("\n"));
        } catch (Exception e) {
            log.warn("Could not fetch exams", e);
            return "No exam schedule available.";
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
                You are an AI assistant for a Student Management System.
                
                RULES:
                - Only answer questions related to school, grades, attendance, courses, enrollments, and administrative procedures
                - Keep responses SHORT (2-3 sentences max)
                - Use simple, clear language
                - Always be helpful and polite
                - If you don't know the answer, say "I don't have that information"
                - Never make up data about grades or attendance
                - Focus on providing accurate, factual information
                """;
            case "TEACHER" -> """
                You are an AI assistant for a Student Management System.
                
                RULES:
                - Only answer questions related to teaching, student management, grading, courses, and administrative tasks
                - Keep responses SHORT (2-3 sentences max)
                - Use professional, clear language
                - Be precise and actionable
                - If you don't know the answer, say "I don't have that information"
                - Never make up data about students or grades
                - Focus on providing accurate, factual information
                """;
            default -> "You are a helpful assistant. Keep responses short and accurate.";
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