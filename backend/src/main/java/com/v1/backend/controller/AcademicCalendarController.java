package com.v1.backend.controller;

import com.v1.backend.model.AcademicCalendar;
import com.v1.backend.service.AcademicCalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calendar")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@RequiredArgsConstructor
public class AcademicCalendarController {
    private final AcademicCalendarService service;

    @GetMapping
    public ResponseEntity<List<AcademicCalendar>> getAllEvents() {
        return ResponseEntity.ok(service.getAllEvents());
    }

    @GetMapping("/type/{eventType}")
    public ResponseEntity<List<AcademicCalendar>> getEventsByType(@PathVariable String eventType) {
        return ResponseEntity.ok(service.getEventsByType(eventType));
    }

    @PostMapping
    public ResponseEntity<AcademicCalendar> createEvent(@RequestBody AcademicCalendar event) {
        return ResponseEntity.ok(service.createEvent(event));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        service.deleteEvent(id);
        return ResponseEntity.ok().build();
    }
}