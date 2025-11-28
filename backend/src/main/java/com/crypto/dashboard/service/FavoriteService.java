package com.crypto.dashboard.service;

import com.crypto.dashboard.entity.CoinFavorite;
import com.crypto.dashboard.entity.User;
import com.crypto.dashboard.exception.ResourceNotFoundException;
import com.crypto.dashboard.exception.ValidationException;
import com.crypto.dashboard.repository.CoinFavoriteRepository;
import com.crypto.dashboard.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final CoinFavoriteRepository favoriteRepository;
    private final UserRepository userRepository;

    public List<CoinFavorite> getUserFavorites(Long userId) {
        return favoriteRepository.findByUser_Id(userId);
    }

    @Transactional
    public CoinFavorite addFavorite(Long userId, String coinId) {
        // avoid duplicate
        favoriteRepository.findByUser_IdAndCoinId(userId, coinId)
                .ifPresent(fav -> {
                    throw new ValidationException("Coin already in favorites");
                });

        // 從資料庫載入 User 實體
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CoinFavorite favorite = new CoinFavorite();
        favorite.setUser(user);
        favorite.setCoinId(coinId);
        // createdAt 由 @CreatedDate 自動處理
        return favoriteRepository.save(favorite);
    }

    @Transactional
    public void removeFavorite(Long userId, String coinId) {
        favoriteRepository.deleteByUser_IdAndCoinId(userId, coinId);
    }
}
