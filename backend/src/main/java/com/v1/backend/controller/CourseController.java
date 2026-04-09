package com.v1.backend.controller;

import com.v1.backend.dto.EnrollmentRequest;
import com.v1.backend.model.Course;
import com.v1.backend.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class CourseController {
    @Autowired
    private CourseService courseService;

    @GetMapping
    public ResponseEntity<?> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Course> createCourse(@Valid @RequestBody Course course) {
        return ResponseEntity.ok(courseService.saveCourse(course));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @Valid @RequestBody Course course) {
        course.setId(id);
        return ResponseEntity.ok(courseService.saveCourse(course));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<List<Course>> getCoursesByClassId(@PathVariable Long classId) {
        return ResponseEntity.ok(courseService.getCoursesByClassId(classId));
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<Course>> getCoursesByTeacherId(@PathVariable Long teacherId) {
        return ResponseEntity.ok(courseService.getCoursesByTeacherId(teacherId));
    }

    @PostMapping("/{courseId}/enroll")
    public ResponseEntity<?> enrollStudent(@PathVariable Long courseId, @RequestBody EnrollmentRequest request) {
        courseService.enrollStudent(courseId, request.getStudentId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{courseId}/unenroll/{studentId}")
    public ResponseEntity<?> unenrollStudent(@PathVariable Long courseId, @PathVariable Long studentId) {
        courseService.unenrollStudent(courseId, studentId);
        return ResponseEntity.ok().build();
    }
}