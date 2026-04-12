package com.v1.backend.controller;

import com.v1.backend.model.Student;
import com.v1.backend.model.Teacher;
import com.v1.backend.repository.StudentRepository;
import com.v1.backend.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class FileUploadController {
    private static final String UPLOAD_DIR = "uploads";

    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private TeacherRepository teacherRepository;

    @PostMapping("/profile")
    public ResponseEntity<String> uploadProfileImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam String type,
            @RequestParam Long id) {
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file");
        }

        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String ext = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
            String filename = UUID.randomUUID().toString() + ext;
            Path filePath = uploadPath.resolve(filename);
            Files.write(filePath, file.getBytes());

            String imageUrl = "/api/upload/images/" + filename;

            if ("student".equals(type)) {
                Student student = studentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Student not found"));
                student.setProfileImage(imageUrl);
                studentRepository.save(student);
            } else if ("teacher".equals(type)) {
                Teacher teacher = teacherRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Teacher not found"));
                teacher.setProfileImage(imageUrl);
                teacherRepository.save(teacher);
            }

            return ResponseEntity.ok(imageUrl);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to upload file");
        }
    }

    @GetMapping("/images/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) throws IOException {
        Path filePath = Paths.get(UPLOAD_DIR, filename);
        if (Files.exists(filePath)) {
            return ResponseEntity.ok()
                .header("Content-Type", Files.probeContentType(filePath))
                .body(Files.readAllBytes(filePath));
        }
        return ResponseEntity.notFound().build();
    }
}