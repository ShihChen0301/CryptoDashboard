-- =============================================
-- CryptoDashboard database schema v3.0
-- MySQL 8.0+
-- Focus: user activity logging, market filter presets, price alerts, comparisons, i18n
-- =============================================

-- Create database
CREATE DATABASE IF NOT EXISTS crypto_dashboard
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE crypto_dashboard;

-- =============================================
-- 1. users
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255) NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    status ENUM('active', 'disabled') NOT NULL DEFAULT 'active',
    trading_experience ENUM('less-than-1', '1-2', '3-5', '5-10', 'more-than-10') NULL,
    preferred_language ENUM('zh-TW', 'en-US') NOT NULL DEFAULT 'zh-TW',
    join_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_username (username),
    UNIQUE KEY uk_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 2. auth_tokens
-- =============================================
CREATE TABLE IF NOT EXISTS auth_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uk_token (token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at),

    CONSTRAINT fk_auth_tokens_user_id
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 3. coin_favorites (Watchlist)
-- =============================================
CREATE TABLE IF NOT EXISTS coin_favorites (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    coin_id VARCHAR(64) NOT NULL COMMENT 'CoinGecko coin id, e.g. bitcoin, ethereum',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uk_user_coin (user_id, coin_id),
    INDEX idx_user_id (user_id),
    INDEX idx_coin_id (coin_id),

    CONSTRAINT fk_coin_favorites_user_id
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 4. announcements
-- =============================================
CREATE TABLE IF NOT EXISTS announcements (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    type ENUM('info', 'success', 'warning') NOT NULL DEFAULT 'info',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by_user_id BIGINT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at),
    INDEX idx_created_by (created_by_user_id),

    CONSTRAINT fk_announcements_created_by
        FOREIGN KEY (created_by_user_id) REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 5. user_activities
-- =============================================
CREATE TABLE IF NOT EXISTS user_activities (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    activity_type ENUM(
        'login',
        'logout',
        'view_coin',
        'add_favorite',
        'remove_favorite',
        'compare_coins',
        'export_data'
    ) NOT NULL,
    coin_id VARCHAR(64) NULL COMMENT 'CoinGecko coin id (nullable)',
    metadata JSON NULL COMMENT 'Extra info such as ip/device',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_user_id (user_id),
    INDEX idx_activity_type (activity_type),
    INDEX idx_created_at (created_at),
    INDEX idx_coin_id (coin_id),

    CONSTRAINT fk_user_activities_user_id
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 6. market_filter_presets
-- =============================================
CREATE TABLE IF NOT EXISTS market_filter_presets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    preset_name VARCHAR(100) NOT NULL COMMENT 'Saved filter name',

    price_min DECIMAL(20, 8) NULL COMMENT 'Lower price bound',
    price_max DECIMAL(20, 8) NULL COMMENT 'Upper price bound',
    market_cap_min BIGINT NULL COMMENT 'Lower market cap bound (USD)',
    market_cap_max BIGINT NULL COMMENT 'Upper market cap bound (USD)',
    volume_24h_min BIGINT NULL COMMENT 'Lower 24h volume bound',
    price_change_24h_min DECIMAL(8, 2) NULL COMMENT 'Lower 24h change (%)',
    price_change_24h_max DECIMAL(8, 2) NULL COMMENT 'Upper 24h change (%)',
    categories JSON NULL COMMENT 'Categories list, e.g. ["DeFi", "Layer 1"]',

    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_user_id (user_id),
    INDEX idx_is_default (is_default),

    CONSTRAINT fk_market_filter_presets_user_id
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 7. coin_price_alerts
-- =============================================
CREATE TABLE IF NOT EXISTS coin_price_alerts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    coin_id VARCHAR(64) NOT NULL COMMENT 'CoinGecko coin id',

    alert_type ENUM('above', 'below') NOT NULL COMMENT 'Price cross direction',
    target_price DECIMAL(20, 8) NOT NULL COMMENT 'Alert price',
    currency VARCHAR(10) NOT NULL DEFAULT 'usd',

    is_triggered BOOLEAN NOT NULL DEFAULT FALSE,
    triggered_at DATETIME NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_user_id (user_id),
    INDEX idx_coin_id (coin_id),
    INDEX idx_is_active (is_active),
    INDEX idx_is_triggered (is_triggered),

    CONSTRAINT fk_coin_price_alerts_user_id
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 8. coin_comparisons
-- =============================================
CREATE TABLE IF NOT EXISTS coin_comparisons (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    comparison_name VARCHAR(100) NULL COMMENT 'Saved comparison name',
    coin_ids JSON NOT NULL COMMENT 'Array of coin ids, e.g. ["bitcoin", "ethereum"]',
    is_saved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_user_id (user_id),
    INDEX idx_is_saved (is_saved),
    INDEX idx_created_at (created_at),

    CONSTRAINT fk_coin_comparisons_user_id
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 9. system_settings
-- =============================================
CREATE TABLE IF NOT EXISTS system_settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    description VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Seed helper (optional)
-- =============================================
-- INSERT INTO users (username, email, password_hash, role, join_date)
-- VALUES ('admin', 'admin@example.com', '$2b$10$YOUR_BCRYPT_HASH_HERE', 'admin', NOW());
--
-- INSERT INTO users (username, email, password_hash, role, join_date)
-- VALUES ('demo_user', 'demo@example.com', '$2b$10$YOUR_BCRYPT_HASH_HERE', 'user', NOW());

-- =============================================
-- Schema version
-- =============================================
-- Version: 3.0
-- Last Updated: 2025-11-27
