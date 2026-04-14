package com.v1.backend.service;

import com.v1.backend.model.ExamSchedule;
import com.v1.backend.repository.ExamScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamScheduleService {
    private final ExamScheduleRepository repository;

    public List<ExamSchedule> getAllExams() {
        return repository.findByIsActiveTrueOrderByExamDateAsc();
    }

    public List<ExamSchedule> getExamsByCourse(Long courseId) {
        return repository.findByCourseIdAndIsActiveTrue(courseId);
    }

    public ExamSchedule createExam(ExamSchedule exam) {
        exam.setIsActive(true);
        return repository.save(exam);
    }

    public void deleteExam(Long id) {
        repository.deleteById(id);
    }

    public List<Map<String, Object>> getAllExamsAsMap() {
        return getAllExams().stream()
                .map(e -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", e.getId());
                    map.put("courseId", e.getCourseId());
                    map.put("courseName", e.getCourseName() != null ? e.getCourseName() : "");
                    map.put("examDate", e.getExamDate() != null ? e.getExamDate().toString() : "");
                    map.put("startTime", e.getStartTime() != null ? e.getStartTime().toString() : "");
                    map.put("endTime", e.getEndTime() != null ? e.getEndTime().toString() : "");
                    map.put("room", e.getRoom() != null ? e.getRoom() : "");
                    map.put("examType", e.getExamType() != null ? e.getExamType() : "");
                    return map;
                })
                .collect(Collectors.toList());
    }
}