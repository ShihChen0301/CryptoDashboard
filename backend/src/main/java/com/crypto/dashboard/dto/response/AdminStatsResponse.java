package com.crypto.dashboard.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter @Setter @AllArgsConstructor
public class AdminStatsResponse {
    private Long totalUsers;
    private Long activeUsers;
    private Long totalFavorites;
    private List<CoinRankDTO> topCoins;

    @Getter @Setter @AllArgsConstructor
    public static class CoinRankDTO {
        private String coinId;
        private Long favoriteCount;
    }
}
