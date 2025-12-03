package com.crypto.dashboard.service;

import com.crypto.dashboard.dto.request.AnnouncementRequest;
import com.crypto.dashboard.dto.response.AnnouncementResponse;
import com.crypto.dashboard.entity.Announcement;
import com.crypto.dashboard.entity.User;
import com.crypto.dashboard.exception.ResourceNotFoundException;
import com.crypto.dashboard.repository.AnnouncementRepository;
import com.crypto.dashboard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private UserRepository userRepository;

    // 取得所有啟用的公告（一般用戶可見）
    public List<AnnouncementResponse> getActiveAnnouncements() {
        List<Announcement> announcements = announcementRepository.findByIsActiveTrue();
        return announcements.stream()
            .map(AnnouncementResponse::fromEntity)
            .collect(Collectors.toList());
    }

    // 取得所有公告（管理員）
    public List<AnnouncementResponse> getAllAnnouncements() {
        List<Announcement> announcements = announcementRepository.findAll();
        return announcements.stream()
            .map(AnnouncementResponse::fromEntity)
            .collect(Collectors.toList());
    }

    // 建立公告
    @Transactional
    public AnnouncementResponse createAnnouncement(AnnouncementRequest request) {
        // 取得當前登入的用戶
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = Long.parseLong(authentication.getName());
        User currentUser = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Announcement announcement = new Announcement();
        announcement.setTitle(request.getTitle());
        announcement.setContent(request.getContent());
        announcement.setType(request.getType());
        announcement.setIsActive(request.getIsActive());
        announcement.setCreatedBy(currentUser);  // 設定建立者
        announcement.setCreatedAt(LocalDateTime.now());
        announcement.setUpdatedAt(LocalDateTime.now());

        Announcement saved = announcementRepository.save(announcement);
        return AnnouncementResponse.fromEntity(saved);
    }

    // 更新公告
    @Transactional
    public AnnouncementResponse updateAnnouncement(Long id, AnnouncementRequest request) {
        Announcement announcement = announcementRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Announcement not found with id: " + id));

        announcement.setTitle(request.getTitle());
        announcement.setContent(request.getContent());
        announcement.setType(request.getType());
        announcement.setIsActive(request.getIsActive());
        announcement.setUpdatedAt(LocalDateTime.now());

        Announcement updated = announcementRepository.save(announcement);
        return AnnouncementResponse.fromEntity(updated);
    }

    // 刪除公告
    @Transactional
    public void deleteAnnouncement(Long id) {
        if (!announcementRepository.existsById(id)) {
            throw new ResourceNotFoundException("Announcement not found with id: " + id);
        }
        announcementRepository.deleteById(id);
    }
}
