package com.v1.backend.controller;

import com.v1.backend.dto.AIChatRequest;
import com.v1.backend.dto.AIChatResponse;
import com.v1.backend.service.RegulationAssistantService;
import com.v1.backend.service.UserDataService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AIAssistantController {

    @Autowired
    private RegulationAssistantService assistantService;

    @Autowired
    private UserDataService userDataService;

    @PostMapping("/chat")
    public ResponseEntity<AIChatResponse> chat(
            @Valid @RequestBody AIChatRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "STUDENT") String role) {
        
        // Get anonymized personal data
        Map<String, Object> personalData = Map.of();
        if (userId != null && "STUDENT".equalsIgnoreCase(role)) {
            personalData = userDataService.getAnonymizedStudentData(userId);
        }
        
        // Get response from AI
        String answer = assistantService.ask(request.getQuestion(), role, personalData);
        
        return ResponseEntity.ok(new AIChatResponse(answer, role));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "OK", "service", "AI Assistant"));
    }
}
