package com.v1.backend.dto;

import java.util.Map;

public class DashboardStats {
    private long totalStudents;
    private long totalTeachers;
    private long totalCourses;
    private long totalClasses;
    private long totalEnrollments;
    private Map<String, Long> studentsPerClass;
    private Map<String, Double> averageGradePerCourse;
    private double averageAttendance;

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }
    public long getTotalTeachers() { return totalTeachers; }
    public void setTotalTeachers(long totalTeachers) { this.totalTeachers = totalTeachers; }
    public long getTotalCourses() { return totalCourses; }
    public void setTotalCourses(long totalCourses) { this.totalCourses = totalCourses; }
    public long getTotalClasses() { return totalClasses; }
    public void setTotalClasses(long totalClasses) { this.totalClasses = totalClasses; }
    public long getTotalEnrollments() { return totalEnrollments; }
    public void setTotalEnrollments(long totalEnrollments) { this.totalEnrollments = totalEnrollments; }
    public Map<String, Long> getStudentsPerClass() { return studentsPerClass; }
    public void setStudentsPerClass(Map<String, Long> studentsPerClass) { this.studentsPerClass = studentsPerClass; }
    public Map<String, Double> getAverageGradePerCourse() { return averageGradePerCourse; }
    public void setAverageGradePerCourse(Map<String, Double> averageGradePerCourse) { this.averageGradePerCourse = averageGradePerCourse; }
    public double getAverageAttendance() { return averageAttendance; }
    public void setAverageAttendance(double averageAttendance) { this.averageAttendance = averageAttendance; }
}