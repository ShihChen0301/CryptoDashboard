-- =============================================
-- CryptoDashboard 資料庫結構
-- MySQL 8.0+
-- =============================================

-- 建立資料庫
CREATE DATABASE IF NOT EXISTS crypto_dashboard
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE crypto_dashboard;

-- =============================================
-- 1. users 使用者表
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255) NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    trading_experience ENUM('less-than-1', '1-2', '3-5', '5-10', 'more-than-10') NULL,
    join_date DATETIME NOT NULL,
    status ENUM('active', 'disabled') NOT NULL DEFAULT 'active',
    last_login_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_username (username),
    UNIQUE KEY uk_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 2. auth_tokens 登入 token 表
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
-- 3. coin_favorites 使用者收藏幣種表 (Watchlist)
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
-- 4. announcements 系統公告表
-- =============================================
CREATE TABLE IF NOT EXISTS announcements (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL COMMENT '公告標題',
    content TEXT NOT NULL COMMENT '公告內容',
    type ENUM('info', 'success', 'warning') NOT NULL DEFAULT 'info' COMMENT '公告類型',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否啟用',
    created_by_user_id BIGINT UNSIGNED NOT NULL COMMENT '建立者 user id',
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
-- 初始資料：建立預設管理員帳號
-- 密碼: admin123 (需要用 bcrypt 加密後替換)
-- =============================================
-- INSERT INTO users (username, email, password_hash, role, join_date) VALUES
-- ('admin', 'admin@example.com', '$2b$10$YOUR_BCRYPT_HASH_HERE', 'admin', NOW());

-- =============================================
-- 初始資料：建立測試用戶
-- 密碼: password (需要用 bcrypt 加密後替換)
-- =============================================
-- INSERT INTO users (username, email, password_hash, role, join_date) VALUES
-- ('demo_user', 'demo@example.com', '$2b$10$YOUR_BCRYPT_HASH_HERE', 'user', NOW());
