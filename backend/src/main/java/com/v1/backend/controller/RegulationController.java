package com.v1.backend.controller;

import com.v1.backend.model.Regulation;
import com.v1.backend.service.RegulationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/regulations")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@RequiredArgsConstructor
public class RegulationController {
    private final RegulationService regulationService;

    @GetMapping
    public ResponseEntity<List<Regulation>> getAllRegulations() {
        return ResponseEntity.ok(regulationService.getAllRegulations());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Regulation>> getRegulationsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(regulationService.getRegulationsByCategory(category));
    }

    @PostMapping
    public ResponseEntity<Regulation> createRegulation(@RequestBody Regulation regulation) {
        return ResponseEntity.ok(regulationService.createRegulation(regulation));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Regulation> updateRegulation(@PathVariable Long id, @RequestBody Regulation regulation) {
        return ResponseEntity.ok(regulationService.updateRegulation(id, regulation));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRegulation(@PathVariable Long id) {
        regulationService.deleteRegulation(id);
        return ResponseEntity.ok().build();
    }
}