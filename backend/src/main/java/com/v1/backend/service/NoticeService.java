package com.v1.backend.service;

import com.v1.backend.model.Notice;
import com.v1.backend.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NoticeService {
    private final NoticeRepository noticeRepository;

    public List<Notice> getAllNotices() {
        return noticeRepository.findByIsActiveTrueOrderByCreatedAtDesc();
    }

    public List<Notice> getNoticesByRole(String role) {
        return noticeRepository.findByTargetRoleAndIsActiveTrueOrderByCreatedAtDesc(role);
    }

    public Notice createNotice(Notice notice) {
        notice.setCreatedAt(LocalDateTime.now());
        notice.setIsActive(true);
        return noticeRepository.save(notice);
    }

    public Notice updateNotice(Long id, Notice notice) {
        Notice existing = noticeRepository.findById(id).orElseThrow();
        existing.setTitle(notice.getTitle());
        existing.setContent(notice.getContent());
        existing.setNoticeType(notice.getNoticeType());
        existing.setTargetRole(notice.getTargetRole());
        return noticeRepository.save(existing);
    }

    public void deleteNotice(Long id) {
        Notice notice = noticeRepository.findById(id).orElseThrow();
        notice.setIsActive(false);
        noticeRepository.save(notice);
    }
}