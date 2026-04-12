package com.v1.backend.service;

import com.v1.backend.dto.EnrollmentRequest;
import com.v1.backend.exception.BadRequestException;
import com.v1.backend.exception.ResourceNotFoundException;
import com.v1.backend.model.Enrollment;
import com.v1.backend.repository.EnrollmentRepository;
import com.v1.backend.repository.CourseRepository;
import com.v1.backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EnrollmentService {
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private StudentRepository studentRepository;

    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    public List<Enrollment> getEnrollmentsByStudent(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }

    public List<Enrollment> getEnrollmentsByCourse(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }

    public Enrollment getEnrollmentById(Long id) {
        return enrollmentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));
    }

    public Enrollment enrollStudent(EnrollmentRequest request) {
        if (enrollmentRepository.existsByStudentIdAndCourseId(request.getStudentId(), request.getCourseId())) {
            throw new BadRequestException("Student already enrolled in this course");
        }
        if (!studentRepository.existsById(request.getStudentId())) {
            throw new ResourceNotFoundException("Student not found");
        }
        if (!courseRepository.existsById(request.getCourseId())) {
            throw new ResourceNotFoundException("Course not found");
        }
        
        Enrollment enrollment = new Enrollment();
        enrollment.setStudentId(request.getStudentId());
        enrollment.setCourseId(request.getCourseId());
        enrollment.setStatus("ENROLLED");
        enrollment.setAttendance(0);
        return enrollmentRepository.save(enrollment);
    }

    public Enrollment updateGrade(Long id, Double grade) {
        Enrollment enrollment = getEnrollmentById(id);
        enrollment.setGrade(grade);
        return enrollmentRepository.save(enrollment);
    }

    public Enrollment updateAttendance(Long id, Integer attendance) {
        Enrollment enrollment = getEnrollmentById(id);
        enrollment.setAttendance(attendance);
        return enrollmentRepository.save(enrollment);
    }

    public Enrollment unenrollStudent(Long id) {
        Enrollment enrollment = getEnrollmentById(id);
        enrollment.setStatus("UNENROLLED");
        return enrollmentRepository.save(enrollment);
    }

    public void deleteEnrollment(Long id) {
        enrollmentRepository.deleteById(id);
    }
}