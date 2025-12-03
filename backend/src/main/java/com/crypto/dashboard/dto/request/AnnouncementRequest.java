package com.crypto.dashboard.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AnnouncementRequest {

    @NotBlank(message = "Title cannot be blank")
    private String title;

    @NotBlank(message = "Content cannot be blank")
    private String content;

    @NotNull(message = "Type cannot be null")
    private com.crypto.dashboard.entity.Announcement.Type type;  // info, success, warning

    @NotNull(message = "Is active cannot be null")
    private Boolean isActive;
}
