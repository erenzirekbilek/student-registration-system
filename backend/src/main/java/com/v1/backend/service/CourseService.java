package com.v1.backend.service;

import com.v1.backend.exception.BadRequestException;
import com.v1.backend.exception.ResourceNotFoundException;
import com.v1.backend.model.Course;
import com.v1.backend.model.Enrollment;
import com.v1.backend.repository.CourseRepository;
import com.v1.backend.repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    public List<Course> getCoursesByClassId(Long classId) {
        return courseRepository.findByClassId(classId);
    }

    public List<Course> getCoursesByTeacherId(Long teacherId) {
        return courseRepository.findByTeacherId(teacherId);
    }
    
    @Transactional
    public void enrollStudent(Long courseId, Long studentId) {
        validateCourseExists(courseId);
        validateNotAlreadyEnrolled(studentId, courseId);
        createEnrollment(studentId, courseId);
    }
    
    @Transactional
    public void unenrollStudent(Long courseId, Long studentId) {
        Enrollment enrollment = findEnrollment(studentId, courseId);
        enrollmentRepository.delete(enrollment);
    }
    
    public List<Enrollment> getEnrollmentsByCourse(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }
    
    public List<Enrollment> getEnrollmentsByStudent(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }

    private void validateCourseExists(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found");
        }
    }

    private void validateNotAlreadyEnrolled(Long studentId, Long courseId) {
        if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            throw new BadRequestException("Student already enrolled in this course");
        }
    }

    private void createEnrollment(Long studentId, Long courseId) {
        Enrollment enrollment = new Enrollment();
        enrollment.setStudentId(studentId);
        enrollment.setCourseId(courseId);
        enrollmentRepository.save(enrollment);
    }

    private Enrollment findEnrollment(Long studentId, Long courseId) {
        return enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));
    }
}