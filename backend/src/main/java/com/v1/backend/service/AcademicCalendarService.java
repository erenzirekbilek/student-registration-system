package com.v1.backend.service;

import com.v1.backend.model.AcademicCalendar;
import com.v1.backend.repository.AcademicCalendarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AcademicCalendarService {
    private final AcademicCalendarRepository repository;

    public List<AcademicCalendar> getAllEvents() {
        return repository.findByIsActiveTrueOrderByStartDateAsc();
    }

    public List<AcademicCalendar> getEventsByType(String eventType) {
        return repository.findByEventTypeAndIsActiveTrueOrderByStartDateAsc(eventType);
    }

    public AcademicCalendar createEvent(AcademicCalendar event) {
        event.setIsActive(true);
        return repository.save(event);
    }

    public void deleteEvent(Long id) {
        repository.deleteById(id);
    }

    public List<Map<String, Object>> getAllEventsAsMap() {
        return getAllEvents().stream()
                .map(e -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", e.getId());
                    map.put("title", e.getTitle() != null ? e.getTitle() : "");
                    map.put("description", e.getDescription() != null ? e.getDescription() : "");
                    map.put("eventType", e.getEventType() != null ? e.getEventType() : "");
                    map.put("startDate", e.getStartDate() != null ? e.getStartDate().toString() : "");
                    map.put("endDate", e.getEndDate() != null ? e.getEndDate().toString() : "");
                    return map;
                })
                .collect(Collectors.toList());
    }
}