package com.v1.backend.service;

import com.v1.backend.model.Student;
import com.v1.backend.model.Attendance;
import com.v1.backend.repository.StudentRepository;
import com.v1.backend.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserDataService {

    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;

    public Map<String, Object> getAnonymizedStudentData(Long studentId) {
        Optional<Student> student = studentRepository.findById(studentId);
        
        if (student.isEmpty()) {
            return Map.of();
        }
        
        Student s = student.get();
        Map<String, Object> data = new HashMap<>();
        
        data.put("Student number", s.getStudentNumber() != null ? s.getStudentNumber() : "N/A");
        data.put("Grade", s.getGrade() != null ? s.getGrade() : "Not assigned");
        
        List<Attendance> attendanceRecords = attendanceRepository.findByStudentId(studentId);
        
        if (!attendanceRecords.isEmpty()) {
            long totalDays = attendanceRecords.size();
            long presentDays = attendanceRecords.stream()
                .filter(a -> "PRESENT".equals(a.getStatus()))
                .count();
            long absentDays = attendanceRecords.stream()
                .filter(a -> "ABSENT".equals(a.getStatus()))
                .count();
            long lateDays = attendanceRecords.stream()
                .filter(a -> "LATE".equals(a.getStatus()))
                .count();
            
            double attendancePercentage = totalDays > 0 ? (presentDays * 100.0 / totalDays) : 0;
            
            data.put("Total attendance records", totalDays);
            data.put("Days present", presentDays);
            data.put("Days absent", absentDays);
            data.put("Days late", lateDays);
            data.put("Attendance percentage", String.format("%.1f%%", attendancePercentage));
            data.put("Recent attendance", attendanceRecords.stream()
                .sorted((a, b) -> b.getDate().compareTo(a.getDate()))
                .limit(5)
                .map(a -> a.getDate() + ": " + a.getStatus())
                .collect(Collectors.toList()));
        } else {
            data.put("Attendance percentage", s.getAttendance() != null ? s.getAttendance() + "%" : "No records");
            data.put("Attendance records", "No attendance records found");
        }
        
        data.put("Max allowed absences", 10);
        data.put("Warning threshold", "Below 80% attendance may affect grades");
        
        return data;
    }

    public Map<String, Object> getAnonymizedTeacherData(Long teacherId) {
        Map<String, Object> data = new HashMap<>();
        data.put("Teacher ID", teacherId);
        data.put("Info", "Teacher data retrieval not implemented");
        return data;
    }
}