package com.v1.backend.controller;

import com.v1.backend.dto.AIChatRequest;
import com.v1.backend.dto.AIChatResponse;
import com.v1.backend.service.RegulationAssistantService;
import com.v1.backend.service.UserDataService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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

        Map<String, Object> personalData = Map.of();
        if (userId != null && "STUDENT".equalsIgnoreCase(role)) {
            personalData = userDataService.getAnonymizedStudentData(userId);
        }

        String answer = assistantService.ask(request.getQuestion(), role, personalData);

        return ResponseEntity.ok(new AIChatResponse(answer, role));
    }

    @GetMapping("/tools")
    public ResponseEntity<Map<String, Object>> getTools() {
        return ResponseEntity.ok(Map.of(
            "tools", List.of(
                Map.of("name", "get_student_info", "description", "Öğrenci bilgilerini getir"),
                Map.of("name", "get_student_grades", "description", "Öğrenci notlarını getir"),
                Map.of("name", "get_student_attendance", "description", "Öğrenci devamsızlık durumunu getir"),
                Map.of("name", "get_all_courses", "description", "Tüm dersleri listele"),
                Map.of("name", "get_course_details", "description", "Ders detaylarını getir"),
                Map.of("name", "get_academic_calendar", "description", "Akademik takvim etkinliklerini getir"),
                Map.of("name", "get_exam_schedule", "description", "Sınav programını getir")
            ),
            "scope", "okul yönetmelikleri, notlar, devamsızlık, dersler, kayıt işlemleri, akademik takvim, sınav programı",
            "offTopicMessage", "Bu konuda bilgi almak için lütfen idari ofise başvurunuz. İletişim: idari@okul.edu.tr",
            "contact", "idari@okul.edu.tr"
        ));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "OK", "service", "AI Assistant"));
    }
}
