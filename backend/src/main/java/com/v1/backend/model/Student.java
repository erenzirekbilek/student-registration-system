package com.v1.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Column(nullable = false, unique = true)
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @Column(nullable = false)
    private String password;
    
    private String phone;
    private String address;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "class_id")
    private Long classId;
    
    @Column(name = "student_number")
    private String studentNumber;
    
    private Integer attendance;
    private String grade;
    private String profileImage;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // ===================== DATA ACCESS (minimal) =====================
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getAddress() { return address; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Long getClassId() { return classId; }
    public String getStudentNumber() { return studentNumber; }
    public Integer getAttendance() { return attendance; }
    public String getGrade() { return grade; }
    public String getProfileImage() { return profileImage; }
    
    public void setName(String name) { this.name = name; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setAddress(String address) { this.address = address; }
    public void setClassId(Long classId) { this.classId = classId; }
    public void setGrade(String grade) { this.grade = grade; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }

    // ===================== TELL, DON'T ASK - Operations =====================
    // Object handles its own password logic
    void setPasswordInternal(String password) { this.password = password; }
    
    public void encodePassword(org.springframework.security.crypto.password.PasswordEncoder encoder) {
        this.password = encoder.encode(this.password);
    }
    
    public boolean matchesPassword(String rawPassword, org.springframework.security.crypto.password.PasswordEncoder encoder) {
        if (password == null) return false;
        if (password.startsWith("$2")) {
            return encoder.matches(rawPassword, password);
        }
        return rawPassword.equals(password);
    }
    
    // Object controls its attendance
    public void recordAttendance(int sessionsMissed) {
        this.attendance = (this.attendance == null ? 0 : this.attendance) + sessionsMissed;
    }
    
    public void markPresent() {
        this.attendance = (this.attendance == null || this.attendance < 0) ? 0 : this.attendance;
    }
    
    public boolean hasExcessiveAbsences() {
        return attendance != null && attendance >= 10;
    }
    
    public boolean isAcademicProbation() {
        return grade != null && (grade.equals("F") || grade.equals("D") || grade.equals("DD"));
    }
    
    // Object manages class enrollment
    public void enrollInClass(Long classId) {
        this.classId = classId;
    }
    
    public void dropClass() {
        this.classId = null;
    }
    
    public boolean isEnrolled() {
        return classId != null;
    }
    
    // Object manages grade evaluation
    public void assignGrade(String letterGrade) {
        this.grade = letterGrade;
    }
    
    public boolean hasPassed() {
        return grade != null && !grade.equals("F") && !grade.equals("D");
    }
    
    // Object validates itself
    public void validateForEnrollment() {
        if (hasExcessiveAbsences()) {
            throw new IllegalStateException("Cannot enroll - excessive absences");
        }
    }
    
    public String getStatus() {
        if (!isEnrolled()) return "Not Enrolled";
        if (hasExcessiveAbsences()) return "Academic Warning";
        if (isAcademicProbation()) return "Probation";
        if (hasPassed()) return "Good Standing";
        return "Enrolled";
    }
}