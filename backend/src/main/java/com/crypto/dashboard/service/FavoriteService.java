package com.crypto.dashboard.service;

import com.crypto.dashboard.entity.CoinFavorite;
import com.crypto.dashboard.entity.User;
import com.crypto.dashboard.exception.ValidationException;
import com.crypto.dashboard.repository.CoinFavoriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final CoinFavoriteRepository favoriteRepository;

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

        User userRef = new User();
        userRef.setId(userId);

        CoinFavorite favorite = new CoinFavorite();
        favorite.setUser(userRef);
        favorite.setCoinId(coinId);
        favorite.setCreatedAt(LocalDateTime.now());
        return favoriteRepository.save(favorite);
    }

    @Transactional
    public void removeFavorite(Long userId, String coinId) {
        favoriteRepository.deleteByUser_IdAndCoinId(userId, coinId);
    }
}
