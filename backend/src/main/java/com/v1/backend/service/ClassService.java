package com.v1.backend.service;

import com.v1.backend.model.SchoolClass;
import com.v1.backend.repository.ClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ClassService implements CommandLineRunner {
    @Autowired
    private ClassRepository classRepository;

    @Override
    public void run(String... args) throws Exception {
        if (classRepository.count() == 0) {
            List<SchoolClass> defaultClasses = List.of(
                createClass("Computer Engineering", "Computer Engineering"),
                createClass("Software Engineering", "Computer Engineering"),
                createClass("Data Science", "Computer Engineering"),
                createClass("AI & Machine Learning", "Computer Engineering"),
                createClass("Cybersecurity", "Computer Engineering"),
                createClass("Electrical Engineering", "Electrical Engineering"),
                createClass("Electronics Engineering", "Electrical Engineering"),
                createClass("Communication Engineering", "Electrical Engineering"),
                createClass("Control Systems", "Electrical Engineering"),
                createClass("Power Systems", "Electrical Engineering"),
                createClass("Mechanical Engineering", "Mechanical Engineering"),
                createClass("Automotive Engineering", "Mechanical Engineering"),
                createClass("Manufacturing Engineering", "Mechanical Engineering"),
                createClass("Aerospace Engineering", "Mechanical Engineering"),
                createClass("Materials Engineering", "Mechanical Engineering"),
                createClass("Civil Engineering", "Civil Engineering"),
                createClass("Structural Engineering", "Civil Engineering"),
                createClass("Environmental Engineering", "Civil Engineering"),
                createClass("Transportation Engineering", "Civil Engineering"),
                createClass("Construction Engineering", "Civil Engineering")
            );
            classRepository.saveAll(defaultClasses);
        }
    }

    private SchoolClass createClass(String name, String department) {
        SchoolClass cls = new SchoolClass();
        cls.setName(name);
        cls.setDepartment(department);
        cls.setYear(java.time.Year.now().getValue());
        return cls;
    }

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