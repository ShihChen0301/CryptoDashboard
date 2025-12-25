package com.crypto.dashboard.service;

import com.crypto.dashboard.dto.response.AdminStatsResponse;
import com.crypto.dashboard.dto.response.UserSummaryDTO;
import com.crypto.dashboard.repository.CoinFavoriteRepository;
import com.crypto.dashboard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CoinFavoriteRepository coinFavoriteRepository;

    // 取得統計數據
    public AdminStatsResponse getStats() {
        // 總用戶數
        Long totalUsers = userRepository.count();

        // 活躍用戶數（7 天內登入）
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        Long activeUsers = userRepository.countByLastLoginAtAfter(sevenDaysAgo);

        // 總收藏數
        Long totalFavorites = coinFavoriteRepository.count();

        // 最多收藏的幣種排行（Top 10）
        List<Object[]> topCoinsRaw = coinFavoriteRepository.findTopFavoriteCoins();
        List<AdminStatsResponse.CoinRankDTO> topCoins = topCoinsRaw.stream()
            .map(row -> new AdminStatsResponse.CoinRankDTO(
                (String) row[0],  // coinId
                ((Number) row[1]).longValue()  // count
            ))
            .collect(Collectors.toList());

        return new AdminStatsResponse(totalUsers, activeUsers, totalFavorites, topCoins);
    }

    // 取得所有用戶列表（含收藏數）
    public List<UserSummaryDTO> getAllUsers() {
        List<Object[]> usersWithFavCount = userRepository.findAllUsersWithFavoriteCount();

        return usersWithFavCount.stream()
            .map(row -> {
                // 處理 Enum 類型的轉換
                String role = row[3] != null ? row[3].toString() : "user";
                String status = row[4] != null ? row[4].toString() : "active";

                return new UserSummaryDTO(
                    ((Number) row[0]).longValue(),  // id
                    (String) row[1],                 // username
                    (String) row[2],                 // email
                    role,                            // role (Enum → String)
                    status,                          // status (Enum → String)
                    (LocalDateTime) row[5],          // joinDate
                    ((Number) row[6]).longValue()    // favoriteCount
                );
            })
            .collect(Collectors.toList());
    }
}
