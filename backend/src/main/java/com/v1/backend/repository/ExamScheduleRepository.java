package com.v1.backend.repository;

import com.v1.backend.model.ExamSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamScheduleRepository extends JpaRepository<ExamSchedule, Long> {
    List<ExamSchedule> findByIsActiveTrueOrderByExamDateAsc();
    List<ExamSchedule> findByCourseIdAndIsActiveTrue(Long courseId);
}