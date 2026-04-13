package com.v1.backend.service;

import com.v1.backend.model.Student;
import com.v1.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserDataService {

    private final StudentRepository studentRepository;

    public Map<String, Object> getAnonymizedStudentData(Long studentId) {
        Optional<Student> student = studentRepository.findById(studentId);
        
        if (student.isEmpty()) {
            return Map.of();
        }
        
        Student s = student.get();
        Map<String, Object> data = new HashMap<>();
        
        data.put("Current absence count", s.getAttendance() != null ? s.getAttendance() : 0);
        data.put("Maximum allowed absences", 10);
        data.put("Grade", s.getGrade() != null ? s.getGrade() : "Not assigned");
        data.put("Student number", s.getStudentNumber() != null ? s.getStudentNumber() : "N/A");
        
        return data;
    }

    public Map<String, Object> getAnonymizedTeacherData(Long teacherId) {
        return Map.of();
    }
}