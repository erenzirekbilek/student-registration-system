package com.v1.backend.service;

import com.v1.backend.dto.UserResponse;
import com.v1.backend.exception.BadRequestException;
import com.v1.backend.factory.UserResponseFactory;
import com.v1.backend.model.Teacher;
import com.v1.backend.repository.TeacherRepository;
import com.v1.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserResponseFactory userResponseFactory;

    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    public Optional<Teacher> getTeacherById(Long id) {
        return teacherRepository.findById(id);
    }

    public Teacher saveTeacher(Teacher teacher) {
        checkEmailAvailability(teacher);
        if (teacher.getPassword() != null) {
            teacher.encodePassword(passwordEncoder);
        }
        return teacherRepository.save(teacher);
    }

    public void deleteTeacher(Long id) {
        teacherRepository.deleteById(id);
    }

    public UserResponse login(String email, String password) {
        Teacher teacher = findTeacherByEmail(email);
        validatePassword(password, teacher);
        return buildLoginResponse(teacher);
    }

    public boolean existsByEmail(String email) {
        return teacherRepository.existsByEmail(email);
    }

    private void checkEmailAvailability(Teacher teacher) {
        if (teacher.getId() == null && teacherRepository.existsByEmail(teacher.getEmail())) {
            throw new BadRequestException("Email already exists");
        }
    }

    private Teacher findTeacherByEmail(String email) {
        return teacherRepository.findByEmail(email)
            .orElseThrow(() -> new BadRequestException("Invalid email or password"));
    }

    private void validatePassword(String rawPassword, Teacher teacher) {
        if (!teacher.matchesPassword(rawPassword, passwordEncoder)) {
            throw new BadRequestException("Invalid email or password");
        }
    }

    private UserResponse buildLoginResponse(Teacher teacher) {
        return userResponseFactory.create(
            jwtService.generateToken(teacher.getEmail(), "TEACHER"),
            teacher.getId(),
            teacher.getName(),
            teacher.getEmail(),
            "TEACHER",
            null
        );
    }
}