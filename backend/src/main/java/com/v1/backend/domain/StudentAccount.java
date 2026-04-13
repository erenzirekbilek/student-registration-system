package com.v1.backend.domain;

import com.v1.backend.model.Student;
import java.util.Objects;

public class StudentAccount {
    
    private final Student student;
    
    public StudentAccount(Student student) {
        this.student = Objects.requireNonNull(student, "Student cannot be null");
    }
    
    // Business logic moved here from model
    public boolean authenticate(String rawPassword) {
        String password = student.getPassword();
        if (password == null) return false;
        if (password.startsWith("$2")) {
            return BCryptPasswordEncoder.matches(rawPassword, password);
        }
        return rawPassword.equals(password);
    }
    
    public void encodePassword() {
        if (student.getPassword() != null) {
            student.setPassword(BCryptPasswordEncoder.encode(student.getPassword()));
        }
    }
    
    public boolean hasExcessiveAbsences() {
        Integer attendance = student.getAttendance();
        return attendance != null && attendance >= 10;
    }
    
    public boolean isAcademicProbation() {
        String grade = student.getGrade();
        return grade != null && (grade.equals("F") || grade.equals("D") || grade.equals("DD"));
    }
    
    public boolean canEnroll() {
        return !hasExcessiveAbsences();
    }
    
    public boolean isEnrolled() {
        return student.getClassId() != null;
    }
    
    public boolean hasPassed() {
        String grade = student.getGrade();
        return grade != null && !grade.equals("F") && !grade.equals("D");
    }
    
    public String getStanding() {
        if (!isEnrolled()) return "Not Enrolled";
        if (hasExcessiveAbsences()) return "Academic Warning";
        if (isAcademicProbation()) return "Probation";
        if (hasPassed()) return "Good Standing";
        return "Enrolled";
    }
    
    // Delegate to underlying entity
    public Long getId() { return student.getId(); }
    public String getName() { return student.getName(); }
    public String getEmail() { return student.getEmail(); }
    public String getPhone() { return student.getPhone(); }
    public String getAddress() { return student.getAddress(); }
    public Long getClassId() { return student.getClassId(); }
    public String getGrade() { return student.getGrade(); }
    public Integer getAttendance() { return student.getAttendance(); }
    
    // State mutations
    public void setName(String name) { student.setName(name); }
    public void setPhone(String phone) { student.setPhone(phone); }
    public void setAddress(String address) { student.setAddress(address); }
    public void setClassId(Long classId) { student.setClassId(classId); }
    
    public void clearClass() {
        student.setClassId(null);
    }
    
    public void addAbsence() {
        Integer current = student.getAttendance();
        student.setAttendance((current == null ? 0 : current) + 1);
    }
    
    public Student getEntity() { return student; }
    
    // Simple BCrypt-like encoder (for demonstration)
    private static class BCryptPasswordEncoder {
        private static String encode(String raw) {
            return "$2a$10$" + raw.hashCode();
        }
        
        private static boolean matches(String raw, String encoded) {
            return encode(raw).equals(encoded);
        }
    }
}