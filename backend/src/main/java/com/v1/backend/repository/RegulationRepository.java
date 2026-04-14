package com.v1.backend.repository;

import com.v1.backend.model.Regulation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegulationRepository extends JpaRepository<Regulation, Long> {
    List<Regulation> findByIsActiveTrueOrderByCategoryAscArticleNumberAsc();
    List<Regulation> findByCategoryAndIsActiveTrueOrderByArticleNumberAsc(String category);
}