package com.crypto.dashboard.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 使用者實體類別
 * 對應資料表：users
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.user;

    @Enumerated(EnumType.STRING)
    @Column(name = "trading_experience")
    private TradingExperience tradingExperience;

    @Column(name = "join_date", nullable = false)
    private LocalDateTime joinDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.active;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 一對多關係
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CoinFavorite> favorites;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AuthToken> authTokens;

    /**
     * 角色枚舉
     */
    public enum Role {
        user, admin
    }

    /**
     * 帳號狀態枚舉
     */
    public enum Status {
        active, disabled
    }

    /**
     * 交易經驗枚舉
     */
    public enum TradingExperience {
        @Column(name = "less-than-1")
        LESS_THAN_1("less-than-1"),

        @Column(name = "1-2")
        ONE_TO_TWO("1-2"),

        @Column(name = "3-5")
        THREE_TO_FIVE("3-5"),

        @Column(name = "5-10")
        FIVE_TO_TEN("5-10"),

        @Column(name = "more-than-10")
        MORE_THAN_TEN("more-than-10");

        private final String value;

        TradingExperience(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
