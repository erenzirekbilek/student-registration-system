package com.v1.backend.service;

import com.v1.backend.model.Regulation;
import com.v1.backend.repository.RegulationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RegulationService {
    private final RegulationRepository regulationRepository;

    public List<Regulation> getAllRegulations() {
        return regulationRepository.findByIsActiveTrueOrderByCategoryAscArticleNumberAsc();
    }

    public List<Map<String, Object>> getAllRegulationsAsMap() {
        return getAllRegulations().stream()
                .map(r -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", r.getId());
                    map.put("title", r.getTitle() != null ? r.getTitle() : "");
                    map.put("content", r.getContent() != null ? r.getContent() : "");
                    map.put("category", r.getCategory() != null ? r.getCategory() : "");
                    map.put("articleNumber", r.getArticleNumber() != null ? r.getArticleNumber() : "");
                    return map;
                })
                .collect(java.util.stream.Collectors.toList());
    }

    public List<Regulation> getRegulationsByCategory(String category) {
        return regulationRepository.findByCategoryAndIsActiveTrueOrderByArticleNumberAsc(category);
    }

    public Regulation createRegulation(Regulation regulation) {
        regulation.setCreatedAt(LocalDateTime.now());
        regulation.setIsActive(true);
        return regulationRepository.save(regulation);
    }

    public Regulation updateRegulation(Long id, Regulation regulation) {
        Regulation existing = regulationRepository.findById(id).orElseThrow();
        existing.setTitle(regulation.getTitle());
        existing.setContent(regulation.getContent());
        existing.setCategory(regulation.getCategory());
        existing.setArticleNumber(regulation.getArticleNumber());
        existing.setUpdatedAt(LocalDateTime.now());
        return regulationRepository.save(existing);
    }

    public void deleteRegulation(Long id) {
        Regulation regulation = regulationRepository.findById(id).orElseThrow();
        regulation.setIsActive(false);
        regulationRepository.save(regulation);
    }
}