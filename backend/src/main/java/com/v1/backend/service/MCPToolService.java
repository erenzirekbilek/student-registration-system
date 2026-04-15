package com.v1.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.v1.backend.model.*;
import com.v1.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class MCPToolService {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final AttendanceRepository attendanceRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final RegulationService regulationService;
    private final AcademicCalendarService calendarService;
    private final ExamScheduleService examService;
    private final ObjectMapper objectMapper;

    public Map<String, Object> executeTool(String toolName, Map<String, Object> arguments) {
        return switch (toolName) {
            case "get_student_info" -> getStudentInfo(arguments);
            case "get_student_grades" -> getStudentGrades(arguments);
            case "get_student_attendance" -> getStudentAttendance(arguments);
            case "get_all_courses" -> getAllCourses();
            case "get_course_details" -> getCourseDetails(arguments);
            case "get_academic_calendar" -> getAcademicCalendar();
            case "get_exam_schedule" -> getExamSchedule();
            default -> Map.of("error", "Unknown tool: " + toolName);
        };
    }

    private Map<String, Object> getStudentInfo(Map<String, Object> args) {
        String studentNumber = (String) args.get("studentNumber");
        if (studentNumber == null) {
            return Map.of("error", "studentNumber is required");
        }

        return studentRepository.findAll().stream()
            .filter(s -> studentNumber.equals(s.getStudentNumber()))
            .findFirst()
            .map(s -> {
                Map<String, Object> info = new HashMap<>();
                info.put("studentNumber", s.getStudentNumber());
                info.put("name", s.getName());
                info.put("email", s.getEmail());
                info.put("grade", s.getGrade());
                info.put("classId", s.getClassId());
                return info;
            })
            .orElse(Map.of("error", "Student not found"));
    }

    private Map<String, Object> getStudentGrades(Map<String, Object> args) {
        String studentNumber = (String) args.get("studentNumber");
        if (studentNumber == null) {
            return Map.of("error", "studentNumber is required");
        }

        Optional<Student> studentOpt = studentRepository.findAll().stream()
            .filter(s -> studentNumber.equals(s.getStudentNumber()))
            .findFirst();

        if (studentOpt.isEmpty()) {
            return Map.of("error", "Student not found");
        }

        Student student = studentOpt.get();
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(student.getId());
        List<Map<String, Object>> grades = new ArrayList<>();

        for (Enrollment e : enrollments) {
            Map<String, Object> gradeInfo = new HashMap<>();
            courseRepository.findById(e.getCourseId()).ifPresent(c -> gradeInfo.put("courseName", c.getName()));
            gradeInfo.put("grade", e.getGrade());
            gradeInfo.put("attendance", e.getAttendance());
            gradeInfo.put("status", e.getStatus());
            grades.add(gradeInfo);
        }

        return Map.of("studentNumber", studentNumber, "grades", grades);
    }

    private Map<String, Object> getStudentAttendance(Map<String, Object> args) {
        String studentNumber = (String) args.get("studentNumber");
        if (studentNumber == null) {
            return Map.of("error", "studentNumber is required");
        }

        Optional<Student> studentOpt = studentRepository.findAll().stream()
            .filter(s -> studentNumber.equals(s.getStudentNumber()))
            .findFirst();

        if (studentOpt.isEmpty()) {
            return Map.of("error", "Student not found");
        }

        Student student = studentOpt.get();
        List<Attendance> records = attendanceRepository.findByStudentId(student.getId());
        long present = records.stream().filter(a -> "PRESENT".equals(a.getStatus())).count();
        long absent = records.stream().filter(a -> "ABSENT".equals(a.getStatus())).count();

        Map<String, Object> result = new HashMap<>();
        result.put("studentNumber", studentNumber);
        result.put("present", present);
        result.put("absent", absent);
        result.put("total", records.size());
        result.put("attendancePercentage", records.isEmpty() ? 0 : (present * 100.0 / records.size()));
        return result;
    }

    private Map<String, Object> getAllCourses() {
        List<Map<String, Object>> courses = courseRepository.findAll()
            .stream()
            .map(c -> {
                Map<String, Object> courseInfo = new HashMap<>();
                courseInfo.put("id", c.getId());
                courseInfo.put("name", c.getName());
                courseInfo.put("credit", c.getCredit());
                courseInfo.put("teacherId", c.getTeacherId());
                return courseInfo;
            })
            .toList();

        return Map.of("courses", courses);
    }

    private Map<String, Object> getCourseDetails(Map<String, Object> args) {
        String courseName = (String) args.get("courseName");
        if (courseName == null) {
            return Map.of("error", "courseName is required");
        }

        return courseRepository.findAll().stream()
            .filter(c -> courseName.equals(c.getName()))
            .findFirst()
            .map(c -> {
                Map<String, Object> details = new HashMap<>();
                details.put("id", c.getId());
                details.put("name", c.getName());
                details.put("description", c.getDescription());
                details.put("credit", c.getCredit());
                details.put("teacherId", c.getTeacherId());
                details.put("schedule", c.getSchedule());
                return details;
            })
            .orElse(Map.of("error", "Course not found"));
    }

    private Map<String, Object> getAcademicCalendar() {
        try {
            List<Map<String, Object>> events = calendarService.getAllEventsAsMap();
            return Map.of("events", events);
        } catch (Exception e) {
            log.warn("Could not fetch calendar", e);
            return Map.of("events", List.of());
        }
    }

    private Map<String, Object> getExamSchedule() {
        try {
            List<Map<String, Object>> exams = examService.getAllExamsAsMap();
            return Map.of("exams", exams);
        } catch (Exception e) {
            log.warn("Could not fetch exams", e);
            return Map.of("exams", List.of());
        }
    }

    public List<String> getAvailableToolNames() {
        return List.of(
            "get_student_info",
            "get_student_grades",
            "get_student_attendance",
            "get_all_courses",
            "get_course_details",
            "get_academic_calendar",
            "get_exam_schedule"
        );
    }
}