package com.v1.backend.service;

import com.v1.backend.dto.LoginResponse;
import com.v1.backend.exception.BadRequestException;
import com.v1.backend.model.Student;
import com.v1.backend.repository.StudentRepository;
import com.v1.backend.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtService jwtService;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    public Student saveStudent(Student student) {
        if (student.getId() == null && studentRepository.existsByEmail(student.getEmail())) {
            throw new BadRequestException("Email already exists");
        }
        if (student.getPassword() != null) {
            student.setPassword(passwordEncoder.encode(student.getPassword()));
        }
        return studentRepository.save(student);
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    public LoginResponse login(String email, String password) {
        return studentRepository.findByEmail(email)
            .filter(s -> {
                // Support both BCrypt and plain text (legacy) passwords
                if (s.getPassword().startsWith("$2")) {
                    return passwordEncoder.matches(password, s.getPassword());
                }
                return Objects.equals(password, s.getPassword());
            })
            .map(s -> new LoginResponse(
                jwtService.generateToken(email, "STUDENT"),
                s.getId(),
                s.getName(),
                s.getEmail(),
                "STUDENT",
                s.getClassId()
            ))
            .orElseThrow(() -> new BadRequestException("Invalid email or password"));
    }

    public boolean existsByEmail(String email) {
        return studentRepository.existsByEmail(email);
    }
}