-- =============================================
-- CryptoDashboard 資料庫結構（詳細中文版）
-- MySQL 8.0+
-- 版本：1.0.0
-- 最後更新：2024-11-23
-- =============================================

-- =============================================
-- 資料庫設定
-- =============================================
-- 建立資料庫，使用 UTF-8 編碼以支援多國語言
CREATE DATABASE IF NOT EXISTS crypto_dashboard
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE crypto_dashboard;

-- =============================================
-- 1. users - 使用者表
-- =============================================
-- 說明：儲存所有註冊使用者的基本資料
-- 功能：登入認證、權限管理、個人資料維護
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    -- 主鍵
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '使用者唯一識別碼',

    -- 基本資料
    username VARCHAR(50) NOT NULL COMMENT '使用者名稱（用於顯示）',
    email VARCHAR(255) NOT NULL COMMENT '電子信箱（用於登入）',
    password_hash VARCHAR(255) NOT NULL COMMENT 'BCrypt 加密後的密碼',
    avatar_url VARCHAR(255) NULL COMMENT '大頭貼 URL（可選）',

    -- 權限與狀態
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user' COMMENT '角色：user=一般用戶, admin=管理員',
    status ENUM('active', 'disabled') NOT NULL DEFAULT 'active' COMMENT '帳號狀態：active=啟用, disabled=停用',

    -- 個人偏好
    trading_experience ENUM('less-than-1', '1-2', '3-5', '5-10', 'more-than-10') NULL
        COMMENT '交易經驗（年）：less-than-1=少於1年, 1-2=1-2年, 3-5=3-5年, 5-10=5-10年, more-than-10=超過10年',

    -- 時間記錄
    join_date DATETIME NOT NULL COMMENT '註冊日期（使用者選擇或系統自動填入）',
    last_login_at DATETIME NULL COMMENT '最後登入時間',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '記錄建立時間（系統自動）',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '記錄更新時間（系統自動）',

    -- 索引
    UNIQUE KEY uk_username (username) COMMENT '使用者名稱唯一約束',
    UNIQUE KEY uk_email (email) COMMENT '電子信箱唯一約束',
    INDEX idx_role (role) COMMENT '加速依角色查詢',
    INDEX idx_status (status) COMMENT '加速依狀態查詢'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='使用者主表 - 儲存所有使用者的基本資料與權限';

-- =============================================
-- 2. auth_tokens - 登入憑證表
-- =============================================
-- 說明：儲存使用者的 JWT Token，用於會話管理
-- 功能：保持登入狀態、Token 驗證、自動登出過期 Token
-- =============================================
CREATE TABLE IF NOT EXISTS auth_tokens (
    -- 主鍵
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Token 唯一識別碼',

    -- 關聯資料
    user_id BIGINT UNSIGNED NOT NULL COMMENT '所屬使用者 ID',

    -- Token 資料
    token VARCHAR(255) NOT NULL COMMENT 'JWT Token 字串',
    expires_at DATETIME NOT NULL COMMENT 'Token 過期時間',

    -- 時間記錄
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Token 建立時間',

    -- 索引
    UNIQUE KEY uk_token (token) COMMENT 'Token 唯一約束',
    INDEX idx_user_id (user_id) COMMENT '加速依使用者查詢',
    INDEX idx_expires_at (expires_at) COMMENT '加速清理過期 Token',

    -- 外鍵約束（使用者刪除時，同步刪除其所有 Token）
    CONSTRAINT fk_auth_tokens_user_id
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='認證憑證表 - 管理使用者的登入 Token';

-- =============================================
-- 3. coin_favorites - 使用者收藏幣種表
-- =============================================
-- 說明：儲存使用者收藏的加密貨幣（Watchlist 功能）
-- 功能：收藏管理、追蹤清單、快速存取常用幣種
-- =============================================
CREATE TABLE IF NOT EXISTS coin_favorites (
    -- 主鍵
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '收藏記錄唯一識別碼',

    -- 關聯資料
    user_id BIGINT UNSIGNED NOT NULL COMMENT '使用者 ID',
    coin_id VARCHAR(64) NOT NULL COMMENT 'CoinGecko 幣種 ID（例如：bitcoin, ethereum, cardano）',

    -- 時間記錄
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '收藏時間',

    -- 索引與約束
    UNIQUE KEY uk_user_coin (user_id, coin_id) COMMENT '防止重複收藏同一幣種',
    INDEX idx_user_id (user_id) COMMENT '加速查詢使用者的收藏列表',
    INDEX idx_coin_id (coin_id) COMMENT '加速統計幣種的收藏次數',

    -- 外鍵約束（使用者刪除時，同步刪除其所有收藏）
    CONSTRAINT fk_coin_favorites_user_id
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='收藏幣種表 - 使用者的 Watchlist 功能';

-- =============================================
-- 4. announcements - 系統公告表
-- =============================================
-- 說明：儲存管理員發布的系統公告
-- 功能：公告管理、通知使用者重要訊息、平台消息發布
-- =============================================
CREATE TABLE IF NOT EXISTS announcements (
    -- 主鍵
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '公告唯一識別碼',

    -- 公告內容
    title VARCHAR(200) NOT NULL COMMENT '公告標題',
    content TEXT NOT NULL COMMENT '公告內容（支援較長文字）',
    type ENUM('info', 'success', 'warning') NOT NULL DEFAULT 'info'
        COMMENT '公告類型：info=一般資訊（藍色）, success=成功消息（綠色）, warning=警告訊息（黃色）',

    -- 狀態管理
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否啟用：true=顯示給使用者, false=已停用',

    -- 關聯資料
    created_by_user_id BIGINT UNSIGNED NOT NULL COMMENT '建立此公告的管理員 ID',

    -- 時間記錄
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '公告建立時間',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '公告更新時間',

    -- 索引
    INDEX idx_is_active (is_active) COMMENT '加速查詢啟用中的公告',
    INDEX idx_created_at (created_at) COMMENT '支援依時間排序',
    INDEX idx_created_by (created_by_user_id) COMMENT '查詢特定管理員發布的公告',

    -- 外鍵約束（管理員刪除時，同步刪除其發布的公告）
    CONSTRAINT fk_announcements_created_by
        FOREIGN KEY (created_by_user_id) REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='系統公告表 - 管理員發布的平台公告';

-- =============================================
-- 初始資料範例
-- =============================================
-- 注意：以下 INSERT 語句被註解，需要時取消註解並修改密碼
-- 密碼需使用 BCrypt 加密（Spring Security 預設）

-- 建立預設管理員帳號
-- 帳號：admin@example.com
-- 密碼：admin123（請使用 BCrypt 加密後替換 YOUR_BCRYPT_HASH_HERE）
-- INSERT INTO users (username, email, password_hash, role, join_date) VALUES
-- ('admin', 'admin@example.com', '$2b$10$YOUR_BCRYPT_HASH_HERE', 'admin', NOW());

-- 建立測試用戶
-- 帳號：demo@example.com
-- 密碼：password（請使用 BCrypt 加密後替換 YOUR_BCRYPT_HASH_HERE）
-- INSERT INTO users (username, email, password_hash, role, join_date) VALUES
-- ('demo_user', 'demo@example.com', '$2b$10$YOUR_BCRYPT_HASH_HERE', 'user', NOW());

-- =============================================
-- 維護說明
-- =============================================
-- 1. 定期清理過期 Token：
--    DELETE FROM auth_tokens WHERE expires_at < NOW();
--
-- 2. 查詢活躍使用者（7天內登入）：
--    SELECT * FROM users WHERE last_login_at > DATE_SUB(NOW(), INTERVAL 7 DAY);
--
-- 3. 統計最多收藏的幣種：
--    SELECT coin_id, COUNT(*) as favorite_count
--    FROM coin_favorites
--    GROUP BY coin_id
--    ORDER BY favorite_count DESC
--    LIMIT 10;
--
-- 4. 查詢啟用中的公告：
--    SELECT a.*, u.username as created_by_name
--    FROM announcements a
--    JOIN users u ON a.created_by_user_id = u.id
--    WHERE a.is_active = TRUE
--    ORDER BY a.created_at DESC;

-- =============================================
-- 資料庫關聯圖（ER Diagram 文字說明）
-- =============================================
-- users (1) ─── (N) auth_tokens
--   └─ user_id
--
-- users (1) ─── (N) coin_favorites
--   └─ user_id
--
-- users (1) ─── (N) announcements
--   └─ created_by_user_id
