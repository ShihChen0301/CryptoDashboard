package com.crypto.dashboard.controller;

import com.crypto.dashboard.dto.request.AnnouncementRequest;
import com.crypto.dashboard.dto.response.AnnouncementResponse;
import com.crypto.dashboard.service.AnnouncementService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController @RequestMapping("/api")
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    // 取得啟用的公告（所有用戶）
    @GetMapping("/announcements")
    public ResponseEntity<List<AnnouncementResponse>> getActiveAnnouncements() {
        List<AnnouncementResponse> announcements = announcementService.getActiveAnnouncements();
        return ResponseEntity.ok(announcements);
    }

    // === 以下為管理員專用 API ===

    // 取得所有公告（管理員）
    @GetMapping("/admin/announcements")
    public ResponseEntity<List<AnnouncementResponse>> getAllAnnouncements() {
        List<AnnouncementResponse> announcements = announcementService.getAllAnnouncements();
        return ResponseEntity.ok(announcements);
    }

    // 建立公告
    @PostMapping("/admin/announcements")
    public ResponseEntity<AnnouncementResponse> createAnnouncement(@Valid @RequestBody AnnouncementRequest request) {
        AnnouncementResponse response = announcementService.createAnnouncement(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 更新公告
    @PutMapping("/admin/announcements/{id}")
    public ResponseEntity<AnnouncementResponse> updateAnnouncement(
            @PathVariable Long id,
            @Valid @RequestBody AnnouncementRequest request) {
        AnnouncementResponse response = announcementService.updateAnnouncement(id, request);
        return ResponseEntity.ok(response);
    }

    // 刪除公告
    @DeleteMapping("/admin/announcements/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id) {
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.noContent().build();
    }
}
