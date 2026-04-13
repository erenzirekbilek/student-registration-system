package com.v1.backend.service;

import com.v1.backend.dto.UserResponse;
import com.v1.backend.exception.BadRequestException;
import com.v1.backend.factory.UserResponseFactory;
import com.v1.backend.model.Student;
import com.v1.backend.repository.StudentRepository;
import com.v1.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserResponseFactory userResponseFactory;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    public Student saveStudent(Student student) {
        checkEmailAvailability(student);
        student.encodePassword(passwordEncoder);
        return studentRepository.save(student);
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    public UserResponse login(String email, String password) {
        Student student = findStudentByEmail(email);
        validateCredentials(password, student);
        return buildLoginResponse(student);
    }

    public boolean existsByEmail(String email) {
        return studentRepository.existsByEmail(email);
    }

    // ENROLLMENT (Tell, Don't Ask)
    public void enrollStudentInClass(Long studentId, Long classId) {
        Student student = findStudentByEmailOrThrow(studentId);
        student.enrollInClass(classId);
        studentRepository.save(student);
    }

    public void dropStudentFromClass(Long studentId) {
        Student student = findStudentByEmailOrThrow(studentId);
        student.dropClass();
        studentRepository.save(student);
    }

    // ATTENDANCE (Tell, Don't Ask)
    public void recordAbsence(Long studentId) {
        Student student = findStudentByEmailOrThrow(studentId);
        student.recordAttendance(1);
        studentRepository.save(student);
    }

    public void markPresent(Long studentId) {
        Student student = findStudentByEmailOrThrow(studentId);
        student.markPresent();
        studentRepository.save(student);
    }

    // GRADES (Tell, Don't Ask)
    public void assignGrade(Long studentId, String grade) {
        Student student = findStudentByEmailOrThrow(studentId);
        student.assignGrade(grade);
        studentRepository.save(student);
    }

    public String getStudentStatus(Long studentId) {
        Student student = findStudentByEmailOrThrow(studentId);
        return student.getStatus();
    }

    private void checkEmailAvailability(Student student) {
        if (student.getId() == null && studentRepository.existsByEmail(student.getEmail())) {
            throw new BadRequestException("Email already exists");
        }
    }

    private Student findStudentByEmail(String email) {
        return studentRepository.findByEmail(email)
            .orElseThrow(() -> new BadRequestException("Invalid email or password"));
    }

    private Student findStudentByEmailOrThrow(Long id) {
        return studentRepository.findById(id)
            .orElseThrow(() -> new BadRequestException("Student not found"));
    }

    private void validateCredentials(String rawPassword, Student student) {
        if (!student.matchesPassword(rawPassword, passwordEncoder)) {
            throw new BadRequestException("Invalid email or password");
        }
    }

    private UserResponse buildLoginResponse(Student student) {
        return userResponseFactory.create(
            jwtService.generateToken(student.getEmail(), "STUDENT"),
            student.getId(),
            student.getName(),
            student.getEmail(),
            "STUDENT",
            student.getClassId()
        );
    }
}