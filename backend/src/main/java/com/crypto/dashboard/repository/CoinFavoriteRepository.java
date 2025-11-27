package com.crypto.dashboard.repository;

import com.crypto.dashboard.entity.CoinFavorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface CoinFavoriteRepository extends JpaRepository<CoinFavorite, Long> {
    List<CoinFavorite> findByUser_Id(Long userId);
    Optional<CoinFavorite> findByUser_IdAndCoinId(Long userId, String coinId);

    @Transactional
    @Modifying
    void deleteByUser_IdAndCoinId(Long userId, String coinId);

    long countByCoinId(String coinId);
}
