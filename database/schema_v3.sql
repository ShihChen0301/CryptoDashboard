-- =============================================
-- CryptoDashboard 資料庫結構 v3.0
-- MySQL 8.0+
-- 新增功能：用戶活動記錄、篩選偏好、價格提醒
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
    status ENUM('active', 'disabled') NOT NULL DEFAULT 'active',
    trading_experience ENUM('less-than-1', '1-2', '3-5', '5-10', 'more-than-10') NULL,
    preferred_language ENUM('zh-TW', 'en-US') NOT NULL DEFAULT 'zh-TW' COMMENT '使用者偏好語系',
    join_date DATETIME NOT NULL,
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
-- 5. user_activities 用戶活動記錄表（新增）
-- 用途：記錄用戶的關鍵操作，供管理員分析用戶行為
-- =============================================
CREATE TABLE IF NOT EXISTS user_activities (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    activity_type ENUM(
        'login',              -- 登入
        'logout',             -- 登出
        'view_coin',          -- 查看幣種詳情
        'add_favorite',       -- 新增收藏
        'remove_favorite',    -- 移除收藏
        'compare_coins',      -- 比較幣種
        'export_data'         -- 匯出數據
    ) NOT NULL,
    coin_id VARCHAR(64) NULL COMMENT '相關幣種 ID（若有）',
    metadata JSON NULL COMMENT '額外資訊（如 IP、裝置等）',
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
-- 6. market_filter_presets 市場篩選預設組合表（新增）
-- 用途：儲存用戶自訂的 Market Overview 篩選條件
-- =============================================
CREATE TABLE IF NOT EXISTS market_filter_presets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    preset_name VARCHAR(100) NOT NULL COMMENT '預設組合名稱，如「高市值穩定幣」',

    -- 篩選條件（JSON 格式）
    price_min DECIMAL(20, 8) NULL COMMENT '最低價格',
    price_max DECIMAL(20, 8) NULL COMMENT '最高價格',
    market_cap_min BIGINT NULL COMMENT '最低市值（USD）',
    market_cap_max BIGINT NULL COMMENT '最高市值（USD）',
    volume_24h_min BIGINT NULL COMMENT '最低 24h 交易量',
    price_change_24h_min DECIMAL(8, 2) NULL COMMENT '最低 24h 漲跌幅（%）',
    price_change_24h_max DECIMAL(8, 2) NULL COMMENT '最高 24h 漲跌幅（%）',
    categories JSON NULL COMMENT '幣種分類標籤，如 ["DeFi", "Layer 1"]',

    is_default BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否為預設篩選',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_user_id (user_id),
    INDEX idx_is_default (is_default),

    CONSTRAINT fk_market_filter_presets_user_id
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 7. coin_price_alerts 價格提醒表（新增）
-- 用途：用戶設定的價格提醒功能
-- =============================================
CREATE TABLE IF NOT EXISTS coin_price_alerts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    coin_id VARCHAR(64) NOT NULL COMMENT 'CoinGecko coin id',

    alert_type ENUM('above', 'below') NOT NULL COMMENT '提醒類型：高於/低於',
    target_price DECIMAL(20, 8) NOT NULL COMMENT '目標價格',
    currency VARCHAR(10) NOT NULL DEFAULT 'usd' COMMENT '貨幣單位',

    is_triggered BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否已觸發',
    triggered_at DATETIME NULL COMMENT '觸發時間',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否啟用',

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
-- 8. coin_comparisons 幣種比較歷史表（新增）
-- 用途：記錄用戶的比較記錄，方便再次查看
-- =============================================
CREATE TABLE IF NOT EXISTS coin_comparisons (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    comparison_name VARCHAR(100) NULL COMMENT '比較組合名稱（用戶可自訂）',
    coin_ids JSON NOT NULL COMMENT '比較的幣種 ID 列表，如 ["bitcoin", "ethereum", "cardano"]',
    is_saved BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否儲存為常用比較',
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

-- =============================================
-- 資料庫 Schema 版本資訊
-- =============================================
-- Version: 3.0
-- Last Updated: 2024-11-27
-- Changes:
--   - 新增 user_activities 表（用戶活動記錄）
--   - 新增 market_filter_presets 表（市場篩選預設）
--   - 新增 coin_price_alerts 表（價格提醒）
--   - 新增 coin_comparisons 表（幣種比較歷史）
--   - users 表新增 preferred_language 欄位
-- =============================================
