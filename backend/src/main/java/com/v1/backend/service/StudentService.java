package com.v1.backend.service;

import com.v1.backend.model.Student;
import com.v1.backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    public Optional<Student> login(String email, String password) {
        return studentRepository.findByEmail(email)
            .filter(s -> Objects.equals(s.getPassword(), password));
    }

    public boolean existsByEmail(String email) {
        return studentRepository.existsByEmail(email);
    }
}