package com.v1.backend.controller;

import com.v1.backend.model.SchoolClass;
import com.v1.backend.service.ClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/classes")
@CrossOrigin(origins = "*")
public class ClassController {
    @Autowired
    private ClassService classService;

    @GetMapping
    public List<SchoolClass> getAllClasses() {
        return classService.getAllClasses();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SchoolClass> getClassById(@PathVariable Long id) {
        return classService.getClassById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public SchoolClass createClass(@RequestBody SchoolClass schoolClass) {
        return classService.saveClass(schoolClass);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SchoolClass> updateClass(@PathVariable Long id, @RequestBody SchoolClass schoolClass) {
        return classService.getClassById(id)
            .map(existing -> {
                schoolClass.setId(id);
                return ResponseEntity.ok(classService.saveClass(schoolClass));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClass(@PathVariable Long id) {
        if (classService.getClassById(id).isPresent()) {
            classService.deleteClass(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}