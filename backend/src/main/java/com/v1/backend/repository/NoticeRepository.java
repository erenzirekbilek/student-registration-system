package com.v1.backend.repository;

import com.v1.backend.model.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findByIsActiveTrueOrderByCreatedAtDesc();
    List<Notice> findByTargetRoleAndIsActiveTrueOrderByCreatedAtDesc(String targetRole);
}