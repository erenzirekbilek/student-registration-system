package com.v1.backend.domain;

import com.v1.backend.model.Enrollment;

public class EnrollmentRecord {
    
    private final Enrollment enrollment;
    
    public EnrollmentRecord(Enrollment enrollment) {
        this.enrollment = enrollment;
    }
    
    // Business logic moved here from model
    public boolean hasPassingGrade() {
        return enrollment.getGrade() != null && enrollment.getGrade() >= 60;
    }
    
    public boolean hasPerfectAttendance() {
        return enrollment.getAttendance() != null && enrollment.getAttendance() == 100;
    }
    
    public boolean isActive() {
        return "ENROLLED".equals(enrollment.getStatus());
    }
    
    public boolean isCompleted() {
        return "COMPLETED".equals(enrollment.getStatus());
    }
    
    public String calculateFinalStatus() {
        if (!isActive() && !isCompleted()) return enrollment.getStatus();
        if (hasPassingGrade() && hasPerfectAttendance()) return "Excellent";
        if (hasPassingGrade()) return "Passed";
        if (hasPerfectAttendance()) return "Attendance OK, Grade Low";
        return "Needs Improvement";
    }
    
    // Delegate to underlying entity
    public Long getId() { return enrollment.getId(); }
    public Long getStudentId() { return enrollment.getStudentId(); }
    public Long getCourseId() { return enrollment.getCourseId(); }
    public Double getGrade() { return enrollment.getGrade(); }
    public Integer getAttendance() { return enrollment.getAttendance(); }
    public String getStatus() { return enrollment.getStatus(); }
    
    // State mutations
    public void assignGrade(Double grade) {
        enrollment.setGrade(grade);
    }
    
    public void clearGrade() {
        enrollment.setGrade(null);
    }
    
    public void incrementAttendance() {
        Integer current = enrollment.getAttendance();
        enrollment.setAttendance((current == null ? 0 : current) + 1);
    }
    
    public void resetAttendance() {
        enrollment.setAttendance(0);
    }
    
    public void markEnrolled() {
        enrollment.setStatus("ENROLLED");
    }
    
    public void markDropped() {
        enrollment.setStatus("DROPPED");
    }
    
    public void markCompleted() {
        enrollment.setStatus("COMPLETED");
    }
    
    public Enrollment getEntity() { return enrollment; }
}