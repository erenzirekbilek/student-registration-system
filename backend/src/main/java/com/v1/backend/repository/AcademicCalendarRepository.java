package com.v1.backend.repository;

import com.v1.backend.model.AcademicCalendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AcademicCalendarRepository extends JpaRepository<AcademicCalendar, Long> {
    List<AcademicCalendar> findByIsActiveTrueOrderByStartDateAsc();
    List<AcademicCalendar> findByEventTypeAndIsActiveTrueOrderByStartDateAsc(String eventType);
}