package com.v1.backend.service;

import com.v1.backend.model.Attendance;
import com.v1.backend.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    public List<Attendance> getAttendanceByStudent(Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    public List<Attendance> getAttendanceByCourse(Long courseId) {
        return attendanceRepository.findByCourseId(courseId);
    }

    public List<Attendance> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByDate(date);
    }

    public Attendance markAttendance(Long studentId, Long courseId, LocalDate date, String status, String notes) {
        return attendanceRepository.findByStudentIdAndCourseIdAndDate(studentId, courseId, date)
            .map(existing -> {
                existing.setStatus(status);
                existing.setNotes(notes);
                return attendanceRepository.save(existing);
            })
            .orElseGet(() -> {
                Attendance attendance = new Attendance();
                attendance.setStudentId(studentId);
                attendance.setCourseId(courseId);
                attendance.setDate(date);
                attendance.setStatus(status);
                attendance.setNotes(notes);
                return attendanceRepository.save(attendance);
            });
    }

    public void deleteAttendance(Long id) {
        attendanceRepository.deleteById(id);
    }
}