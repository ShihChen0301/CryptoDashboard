package com.crypto.dashboard.controller;

import com.crypto.dashboard.dto.request.UpdateProfileRequest;
import com.crypto.dashboard.dto.response.ApiResponse;
import com.crypto.dashboard.entity.User;
import com.crypto.dashboard.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfile(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("username", user.getUsername());
        profile.put("email", user.getEmail());
        profile.put("role", user.getRole().name());
        profile.put("joinDate", user.getJoinDate());
        profile.put("tradingExperience", user.getTradingExperience());

        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request) {

        Long userId = (Long) authentication.getPrincipal();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 更新允許修改的欄位
        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            user.setUsername(request.getUsername());
        }
        if (request.getTradingExperience() != null) {
            user.setTradingExperience(request.getTradingExperience());
        }

        userRepository.save(user);

        // 返回更新後的資料
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("username", user.getUsername());
        profile.put("email", user.getEmail());
        profile.put("role", user.getRole().name());
        profile.put("joinDate", user.getJoinDate());
        profile.put("tradingExperience", user.getTradingExperience());

        return ResponseEntity.ok(ApiResponse.success(profile));
    }
}
