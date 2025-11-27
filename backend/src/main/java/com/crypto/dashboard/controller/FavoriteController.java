package com.crypto.dashboard.controller;

import com.crypto.dashboard.dto.response.ApiResponse;
import com.crypto.dashboard.entity.CoinFavorite;
import com.crypto.dashboard.service.FavoriteService;
import com.crypto.dashboard.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CoinFavorite>>> getFavorites(
            @RequestHeader("Authorization") String tokenHeader) {
        Long userId = jwtUtil.getUserIdFromToken(tokenHeader.replace("Bearer ", ""));
        List<CoinFavorite> favorites = favoriteService.getUserFavorites(userId);
        return ResponseEntity.ok(ApiResponse.success(favorites));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CoinFavorite>> addFavorite(
            @RequestHeader("Authorization") String tokenHeader,
            @RequestParam String coinId) {
        Long userId = jwtUtil.getUserIdFromToken(tokenHeader.replace("Bearer ", ""));
        CoinFavorite favorite = favoriteService.addFavorite(userId, coinId);
        return ResponseEntity.ok(ApiResponse.success(favorite));
    }

    @DeleteMapping("/{coinId}")
    public ResponseEntity<ApiResponse<Void>> removeFavorite(
            @RequestHeader("Authorization") String tokenHeader,
            @PathVariable String coinId) {
        Long userId = jwtUtil.getUserIdFromToken(tokenHeader.replace("Bearer ", ""));
        favoriteService.removeFavorite(userId, coinId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
