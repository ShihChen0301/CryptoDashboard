package com.crypto.dashboard.repository;

import com.crypto.dashboard.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // 既有的方法...
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

    // 新增：計算活躍用戶數（7 天內登入）
    Long countByLastLoginAtAfter(LocalDateTime date);

    // 新增：取得所有用戶及其收藏數
    @Query("SELECT u.id, u.username, u.email, u.role, u.status, u.joinDate, u.lastLoginAt, " +
           "COALESCE(COUNT(f.id), 0) as favoriteCount " +
           "FROM User u LEFT JOIN u.favorites f " +
           "GROUP BY u.id, u.username, u.email, u.role, u.status, u.joinDate, u.lastLoginAt " +
           "ORDER BY u.joinDate DESC")
    List<Object[]> findAllUsersWithFavoriteCount();
}
