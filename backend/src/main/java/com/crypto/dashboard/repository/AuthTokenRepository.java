package com.crypto.dashboard.repository;

import com.crypto.dashboard.entity.AuthToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface AuthTokenRepository extends JpaRepository<AuthToken, Long> {
    Optional<AuthToken> findByToken(String token);

    @Transactional
    @Modifying
    void deleteByUser_Id(Long userId);

    @Transactional
    @Modifying
    void deleteByToken(String token);
}
