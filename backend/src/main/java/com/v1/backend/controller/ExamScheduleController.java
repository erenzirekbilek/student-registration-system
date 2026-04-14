package com.v1.backend.controller;

import com.v1.backend.model.ExamSchedule;
import com.v1.backend.service.ExamScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@RequiredArgsConstructor
public class ExamScheduleController {
    private final ExamScheduleService service;

    @GetMapping
    public ResponseEntity<List<ExamSchedule>> getAllExams() {
        return ResponseEntity.ok(service.getAllExams());
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<ExamSchedule>> getExamsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(service.getExamsByCourse(courseId));
    }

    @PostMapping
    public ResponseEntity<ExamSchedule> createExam(@RequestBody ExamSchedule exam) {
        return ResponseEntity.ok(service.createExam(exam));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExam(@PathVariable Long id) {
        service.deleteExam(id);
        return ResponseEntity.ok().build();
    }
}