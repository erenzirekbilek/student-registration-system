package com.v1.backend.service;

import com.v1.backend.dto.LoginResponse;
import com.v1.backend.exception.BadRequestException;
import com.v1.backend.model.Teacher;
import com.v1.backend.repository.TeacherRepository;
import com.v1.backend.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class TeacherService {
    @Autowired
    private TeacherRepository teacherRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtService jwtService;

    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    public Optional<Teacher> getTeacherById(Long id) {
        return teacherRepository.findById(id);
    }

    public Teacher saveTeacher(Teacher teacher) {
        if (teacher.getId() == null && teacherRepository.existsByEmail(teacher.getEmail())) {
            throw new BadRequestException("Email already exists");
        }
        if (teacher.getPassword() != null) {
            teacher.setPassword(passwordEncoder.encode(teacher.getPassword()));
        }
        return teacherRepository.save(teacher);
    }

    public void deleteTeacher(Long id) {
        teacherRepository.deleteById(id);
    }

    public LoginResponse login(String email, String password) {
        return teacherRepository.findByEmail(email)
            .filter(t -> {
                if (t.getPassword().startsWith("$2")) {
                    return passwordEncoder.matches(password, t.getPassword());
                }
                return Objects.equals(password, t.getPassword());
            })
            .map(t -> new LoginResponse(
                jwtService.generateToken(email, "TEACHER"),
                t.getId(),
                t.getName(),
                t.getEmail(),
                "TEACHER",
                null
            ))
            .orElseThrow(() -> new BadRequestException("Invalid email or password"));
    }

    public boolean existsByEmail(String email) {
        return teacherRepository.existsByEmail(email);
    }
}