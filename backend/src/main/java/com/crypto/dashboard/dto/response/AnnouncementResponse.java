package com.crypto.dashboard.dto.response;

import com.crypto.dashboard.entity.Announcement;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter @AllArgsConstructor
public class AnnouncementResponse {
    private Long id;
    private String title;
    private String content;
    private com.crypto.dashboard.entity.Announcement.Type type;
    private Boolean isActive;
    private String createdBy;  // 建立者用戶名
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AnnouncementResponse fromEntity(Announcement announcement) {
        return new AnnouncementResponse(
            announcement.getId(),
            announcement.getTitle(),
            announcement.getContent(),
            announcement.getType(),
            announcement.getIsActive(),
            announcement.getCreatedBy().getUsername(),  // 取得建立者用戶名
            announcement.getCreatedAt(),
            announcement.getUpdatedAt()
        );
    }
}
