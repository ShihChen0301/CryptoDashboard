package com.crypto.dashboard.controller;

import com.crypto.dashboard.dto.response.AdminStatsResponse;
import com.crypto.dashboard.dto.response.UserSummaryDTO;
import com.crypto.dashboard.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController @RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // 取得統計數據
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        AdminStatsResponse stats = adminService.getStats();
        return ResponseEntity.ok(stats);
    }

    // 取得所有用戶列表
    @GetMapping("/users")
    public ResponseEntity<List<UserSummaryDTO>> getAllUsers() {
        List<UserSummaryDTO> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}
