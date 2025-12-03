package com.crypto.dashboard.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter @AllArgsConstructor
public class UserSummaryDTO {
    private Long id;
    private String username;
    private String email;
    private String role;
    private String status;
    private LocalDateTime joinDate;
    private LocalDateTime lastLogin;
    private Long favoriteCount;
}
