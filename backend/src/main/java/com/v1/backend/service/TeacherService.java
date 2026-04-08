package com.v1.backend.service;

import com.v1.backend.model.Teacher;
import com.v1.backend.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class TeacherService {
    @Autowired
    private TeacherRepository teacherRepository;

    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    public Optional<Teacher> getTeacherById(Long id) {
        return teacherRepository.findById(id);
    }

    public Teacher saveTeacher(Teacher teacher) {
        return teacherRepository.save(teacher);
    }

    public void deleteTeacher(Long id) {
        teacherRepository.deleteById(id);
    }

    public Optional<Teacher> login(String email, String password) {
        return teacherRepository.findByEmail(email)
            .filter(t -> Objects.equals(t.getPassword(), password));
    }

    public boolean existsByEmail(String email) {
        return teacherRepository.existsByEmail(email);
    }
}