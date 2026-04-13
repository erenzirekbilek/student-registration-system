package com.v1.backend.service;

import com.v1.backend.dto.UserResponse;
import com.v1.backend.exception.BadRequestException;
import com.v1.backend.factory.UserResponseFactory;
import com.v1.backend.model.Student;
import com.v1.backend.repository.StudentRepository;
import com.v1.backend.security.JwtService;
import com.v1.backend.util.PasswordUtils;
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
        encodePasswordIfProvided(student);
        return studentRepository.save(student);
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    public UserResponse login(String email, String password) {
        Student student = findStudentByEmail(email);
        validatePassword(password, student.getPassword());
        return buildLoginResponse(student);
    }

    public boolean existsByEmail(String email) {
        return studentRepository.existsByEmail(email);
    }

    private void checkEmailAvailability(Student student) {
        if (student.getId() == null && studentRepository.existsByEmail(student.getEmail())) {
            throw new BadRequestException("Email already exists");
        }
    }

    private void encodePasswordIfProvided(Student student) {
        if (student.getPassword() != null) {
            student.setPassword(passwordEncoder.encode(student.getPassword()));
        }
    }

    private Student findStudentByEmail(String email) {
        return studentRepository.findByEmail(email)
            .orElseThrow(() -> new BadRequestException("Invalid email or password"));
    }

    private void validatePassword(String rawPassword, String storedPassword) {
        if (!PasswordUtils.matches(rawPassword, storedPassword, passwordEncoder)) {
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