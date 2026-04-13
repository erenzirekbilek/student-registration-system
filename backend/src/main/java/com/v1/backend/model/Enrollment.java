package com.v1.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "student_id", nullable = false)
    private Long studentId;
    
    @Column(name = "course_id", nullable = false)
    private Long courseId;
    
    private Double grade;
    private Integer attendance;
    private String status;
    
    @Column(name = "enrolled_at")
    private LocalDateTime enrolledAt;
    
    @PrePersist
    protected void onCreate() {
        enrolledAt = LocalDateTime.now();
        if (status == null) status = "ENROLLED";
        if (attendance == null) attendance = 0;
    }

    // ===================== DATA ACCESS =====================
    public Long getId() { return id; }
    public Long getStudentId() { return studentId; }
    public Long getCourseId() { return courseId; }
    public Double getGrade() { return grade; }
    public Integer getAttendance() { return attendance; }
    public String getStatus() { return status; }
    public LocalDateTime getEnrolledAt() { return enrolledAt; }

    // ===================== TELL, DON'T ASK - Operations =====================
    public void setId(Long id) { this.id = id; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    
    // Grade operations
    public void assignGrade(Double letterGrade) {
        this.grade = letterGrade;
    }
    
    public boolean hasPassingGrade() {
        return grade != null && grade >= 60;
    }
    
    public void clearGrade() {
        this.grade = null;
    }
    
    // Attendance operations
    public void incrementAttendance() {
        this.attendance = (this.attendance == null ? 0 : this.attendance) + 1;
    }
    
    public void resetAttendance() {
        this.attendance = 0;
    }
    
    public boolean hasPerfectAttendance() {
        return attendance != null && attendance == 100;
    }
    
    // Status operations
    public void enroll() {
        this.status = "ENROLLED";
    }
    
    public void drop() {
        this.status = "DROPPED";
    }
    
    public void complete() {
        this.status = "COMPLETED";
    }
    
    public boolean isActive() {
        return "ENROLLED".equals(status);
    }
    
    public boolean isCompleted() {
        return "COMPLETED".equals(status);
    }
    
    // Calculate final status
    public String calculateFinalStatus() {
        if (!isActive() && !isCompleted()) return status;
        if (hasPassingGrade() && hasPerfectAttendance()) return "Excellent";
        if (hasPassingGrade()) return "Passed";
        if (hasPerfectAttendance()) return "Attendace OK, Grade Low";
        return "Needs Improvement";
    }
}