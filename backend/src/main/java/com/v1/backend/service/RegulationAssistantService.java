package com.v1.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
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

import java.util.*;
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
    private final MCPToolService mcpToolService;

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
            String systemPrompt = buildSystemMessageWithTools(role);

            ObjectNode requestBody = objectMapper.createObjectNode();
            requestBody.put("model", model);
            requestBody.put("temperature", 0.1);
            requestBody.put("top_p", 0.5);
            requestBody.put("max_tokens", 2048);

            ArrayNode messages = requestBody.putArray("messages");
            messages.addObject().put("role", "system").put("content", systemPrompt);

            String userMessage = buildContextText(personalData)
                + "\n\nQuestion: " + question;
            messages.addObject().put("role", "user").put("content", userMessage);

            ArrayNode tools = requestBody.putArray("tools");
            tools.add(createToolDefinition("get_student_info", "Get information about a specific student",
                Map.of("studentNumber", Map.of("type", "string", "description", "The student's unique number"))));
            tools.add(createToolDefinition("get_student_grades", "Get grades for a specific student",
                Map.of("studentNumber", Map.of("type", "string", "description", "The student's unique number"))));
            tools.add(createToolDefinition("get_student_attendance", "Get attendance for a specific student",
                Map.of("studentNumber", Map.of("type", "string", "description", "The student's unique number"))));
            tools.add(createToolDefinition("get_all_courses", "Get all available courses", Map.of()));
            tools.add(createToolDefinition("get_course_details", "Get details about a specific course",
                Map.of("courseName", Map.of("type", "string", "description", "The name of the course"))));
            tools.add(createToolDefinition("get_academic_calendar", "Get academic calendar events", Map.of()));
            tools.add(createToolDefinition("get_exam_schedule", "Get exam schedule", Map.of()));

            String requestBodyJson = objectMapper.writeValueAsString(requestBody);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + groqApiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(requestBodyJson, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(baseUrl, entity, String.class);

            var responseJson = objectMapper.readTree(response.getBody());
            var firstChoice = responseJson.path("choices").get(0);
            var assistantMessage = firstChoice.path("message");

            if (assistantMessage.has("tool_calls") && assistantMessage.path("tool_calls").size() > 0) {
                return processToolCalls((ObjectNode) assistantMessage, personalData);
            }

            return assistantMessage.path("content").asText("I couldn't process your request.");

        } catch (Exception e) {
            log.error("Failed to call Groq API", e);
            return "The AI assistant is temporarily unavailable. Please try again later.";
        }
    }

    private ObjectNode createToolDefinition(String name, String description, Map<String, Map<String, String>> params) {
        ObjectNode tool = objectMapper.createObjectNode();
        tool.put("type", "function");

        ObjectNode function = tool.putObject("function");
        function.put("name", name);
        function.put("description", description);

        ObjectNode properties = function.putObject("parameters");
        properties.put("type", "object");
        ObjectNode props = properties.putObject("properties");

        if (params.isEmpty()) {
            properties.putArray("required");
            return tool;
        }

        ArrayNode required = properties.putArray("required");
        for (var entry : params.entrySet()) {
            required.add(entry.getKey());
            ObjectNode prop = props.putObject(entry.getKey());
            prop.put("type", entry.getValue().get("type"));
            prop.put("description", entry.getValue().get("description"));
        }

        return tool;
    }

    private String processToolCalls(ObjectNode assistantMessage, Map<String, Object> personalData) {
        try {
            ArrayNode toolCalls = (ArrayNode) assistantMessage.path("tool_calls");
            StringBuilder results = new StringBuilder();

            for (var toolCall : toolCalls) {
                String toolName = toolCall.path("function").path("name").asText();
                JsonNode argsNode = toolCall.path("function").path("arguments");
                Map<String, Object> arguments;
                if (argsNode.isObject()) {
                    arguments = objectMapper.convertValue(argsNode, Map.class);
                } else if (argsNode.isTextual()) {
                    arguments = objectMapper.readValue(argsNode.asText(), Map.class);
                } else {
                    arguments = Map.of();
                }

                if ("get_student_info".equals(toolName) || "get_student_grades".equals(toolName) || "get_student_attendance".equals(toolName)) {
                    String studentNum = (String) personalData.get("Student number");
                    arguments.put("studentNumber", studentNum);
                }

                Map<String, Object> result = mcpToolService.executeTool(toolName, arguments);
                results.append("[").append(toolName).append("] ").append(objectMapper.writeValueAsString(result)).append("\n");
            }

            return "Based on the data:\n" + results.toString();

        } catch (Exception e) {
            log.error("Failed to process tool calls", e);
            return "I encountered an error retrieving the requested information.";
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

    private String buildSystemMessageWithTools(String role) {
        String toolsSection = """

            IMPORTANT SCOPE LIMITATIONS:
            - ONLY answer questions about: school regulations, grades, attendance, courses, enrollments, academic calendar, exam schedules, and student procedures
            - For questions OUTSIDE this scope, respond ONLY with: "Bu konuda bilgi almak için lütfen idari ofise başvurunuz. İletişim: idari@okul.edu.tr"
            - NEVER make up information or answer questions about: personal advice, general knowledge, news, weather, other institutions, etc.

            AVAILABLE TOOLS: When you need to get specific data, use these tools:
            - get_student_info: Get student details by studentNumber
            - get_student_grades: Get grades for a student
            - get_student_attendance: Get attendance records
            - get_academic_calendar: Get calendar events
            - get_exam_schedule: Get exam schedule

            IMPORTANT: Only use tools when you need specific data. Otherwise, answer from your knowledge.
            """;

        return switch (role) {
            case "STUDENT" -> """
                You are an AI assistant for a Student Management System.

                RULES (STRICT):
                - ONLY answer questions about: school regulations, grades, attendance, courses, enrollments, academic calendar, exam schedules
                - For OFF-TOPIC questions, respond ONLY with: "Bu konuda bilgi almak için lütfen idari ofise başvurunuz. İletişim: idari@okul.edu.tr"
                - NEVER answer questions outside this scope (personal advice, weather, news, general knowledge, other institutions)
                - Keep responses SHORT (2-3 sentences max)
                - Use simple, clear language
                - Always be helpful and polite
                - Never make up data about grades or attendance
                - Focus on providing accurate, factual information
                """ + toolsSection;
            case "TEACHER" -> """
                You are an AI assistant for a Student Management System.

                RULES (STRICT):
                - ONLY answer questions about: teaching, student management, grading, courses, academic calendar, exam schedules, school procedures
                - For OFF-TOPIC questions, respond ONLY with: "Bu konuda bilgi almak için lütfen idari ofise başvurunuz. İletişim: idari@okul.edu.tr"
                - NEVER answer questions outside this scope (personal advice, weather, news, general knowledge, other institutions)
                - Keep responses SHORT (2-3 sentences max)
                - Use professional, clear language
                - Be precise and actionable
                - Never make up data about students or grades
                - Focus on providing accurate, factual information
                """ + toolsSection;
            default -> "You are an AI assistant for a Student Management System. Only answer questions about school-related topics. For off-topic: 'Bu konuda bilgi almak için lütfen idari ofise başvurunuz. İletişim: idari@okul.edu.tr'" + toolsSection;
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