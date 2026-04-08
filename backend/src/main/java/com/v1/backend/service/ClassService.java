package com.v1.backend.service;

import com.v1.backend.model.SchoolClass;
import com.v1.backend.repository.ClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ClassService {
    @Autowired
    private ClassRepository classRepository;

    public List<SchoolClass> getAllClasses() {
        return classRepository.findAll();
    }

    public Optional<SchoolClass> getClassById(Long id) {
        return classRepository.findById(id);
    }

    public SchoolClass saveClass(SchoolClass schoolClass) {
        return classRepository.save(schoolClass);
    }

    public void deleteClass(Long id) {
        classRepository.deleteById(id);
    }
}