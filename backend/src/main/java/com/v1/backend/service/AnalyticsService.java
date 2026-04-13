package com.v1.backend.service;

import com.v1.backend.dto.DashboardStats;
import com.v1.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final CourseRepository courseRepository;
    private final ClassRepository classRepository;
    private final EnrollmentRepository enrollmentRepository;

    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();
        stats.setTotalStudents(studentRepository.count());
        stats.setTotalTeachers(teacherRepository.count());
        stats.setTotalCourses(courseRepository.count());
        stats.setTotalClasses(classRepository.count());
        stats.setTotalEnrollments(enrollmentRepository.count());
        
        stats.setStudentsPerClass(getStudentsPerClass());
        stats.setAverageGradePerCourse(getAverageGradePerCourse());
        stats.setAverageAttendance(getAverageAttendance());
        
        return stats;
    }

    private Map<String, Long> getStudentsPerClass() {
        return studentRepository.findAll().stream()
            .collect(Collectors.groupingBy(
                s -> {
                    Long classId = s.getClassId();
                    if (classId == null) return "No Class";
                    return classRepository.findById(classId)
                        .map(com.v1.backend.model.SchoolClass::getName)
                        .orElse("Class " + classId);
                },
                Collectors.counting()
            ));
    }

    private Map<String, Double> getAverageGradePerCourse() {
        return enrollmentRepository.findAll().stream()
            .filter(e -> e.getGrade() != null)
            .collect(Collectors.groupingBy(
                e -> {
                    Long courseId = e.getCourseId();
                    return courseRepository.findById(courseId)
                        .map(com.v1.backend.model.Course::getName)
                        .orElse("Course " + courseId);
                },
                Collectors.averagingDouble(e -> e.getGrade())
            ));
    }

    private double getAverageAttendance() {
        List<Double> grades = enrollmentRepository.findAll().stream()
            .filter(e -> e.getAttendance() != null)
            .map(e -> (double) e.getAttendance())
            .collect(Collectors.toList());
        return grades.isEmpty() ? 0 : grades.stream().mapToDouble(Double::doubleValue).average().orElse(0);
    }
}