-- =============================================
-- CryptoDashboard 資料庫結構（完全中文版）
-- MySQL 8.0+
-- 版本：2.0.0
-- 最後更新：2024-11-24
-- 說明：此版本為完全中文化版本，供對照參考使用
--      實際部署建議使用 schema.sql（英文版）
-- =============================================

-- =============================================
-- 資料庫設定
-- =============================================
-- 建立資料庫，使用 UTF-8 編碼以支援多國語言
CREATE DATABASE IF NOT EXISTS crypto_dashboard_zh
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE crypto_dashboard_zh;

-- =============================================
-- 1. 使用者表
-- =============================================
-- 說明：儲存所有註冊使用者的基本資料
-- 功能：登入認證、權限管理、個人資料維護
-- =============================================
CREATE TABLE IF NOT EXISTS 使用者 (
    -- 主鍵
    編號 BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '使用者唯一識別碼',

    -- 基本資料
    使用者名稱 VARCHAR(50) NOT NULL COMMENT '使用者名稱（用於顯示）',
    電子信箱 VARCHAR(255) NOT NULL COMMENT '電子信箱（用於登入）',
    密碼加密值 VARCHAR(255) NOT NULL COMMENT 'BCrypt 加密後的密碼',
    大頭貼網址 VARCHAR(255) NULL COMMENT '大頭貼 URL（可選）',

    -- 權限與狀態
    角色 ENUM('user', 'admin') NOT NULL DEFAULT 'user' COMMENT '角色：user=一般用戶, admin=管理員',
    狀態 ENUM('active', 'disabled') NOT NULL DEFAULT 'active' COMMENT '帳號狀態：active=啟用, disabled=停用',

    -- 個人偏好
    交易經驗 ENUM('less-than-1', '1-2', '3-5', '5-10', 'more-than-10') NULL
        COMMENT '交易經驗（年）：less-than-1=少於1年, 1-2=1-2年, 3-5=3-5年, 5-10=5-10年, more-than-10=超過10年',

    -- 時間記錄
    註冊日期 DATETIME NOT NULL COMMENT '註冊日期（使用者選擇或系統自動填入）',
    最後登入時間 DATETIME NULL COMMENT '最後登入時間',
    建立時間 DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '記錄建立時間（系統自動）',
    更新時間 DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '記錄更新時間（系統自動）',

    -- 索引
    UNIQUE KEY 唯一鍵_使用者名稱 (使用者名稱) COMMENT '使用者名稱唯一約束',
    UNIQUE KEY 唯一鍵_電子信箱 (電子信箱) COMMENT '電子信箱唯一約束',
    INDEX 索引_角色 (角色) COMMENT '加速依角色查詢',
    INDEX 索引_狀態 (狀態) COMMENT '加速依狀態查詢'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='使用者主表 - 儲存所有使用者的基本資料與權限';

-- =============================================
-- 2. 登入憑證表
-- =============================================
-- 說明：儲存使用者的 JWT Token，用於會話管理
-- 功能：保持登入狀態、Token 驗證、自動登出過期 Token
-- =============================================
CREATE TABLE IF NOT EXISTS 登入憑證 (
    -- 主鍵
    編號 BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Token 唯一識別碼',

    -- 關聯資料
    使用者編號 BIGINT UNSIGNED NOT NULL COMMENT '所屬使用者 ID',

    -- Token 資料
    憑證 VARCHAR(255) NOT NULL COMMENT 'JWT Token 字串',
    過期時間 DATETIME NOT NULL COMMENT 'Token 過期時間',

    -- 時間記錄
    建立時間 DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Token 建立時間',

    -- 索引
    UNIQUE KEY 唯一鍵_憑證 (憑證) COMMENT 'Token 唯一約束',
    INDEX 索引_使用者編號 (使用者編號) COMMENT '加速依使用者查詢',
    INDEX 索引_過期時間 (過期時間) COMMENT '加速清理過期 Token',

    -- 外鍵約束（使用者刪除時，同步刪除其所有 Token）
    CONSTRAINT 外鍵_登入憑證_使用者編號
        FOREIGN KEY (使用者編號) REFERENCES 使用者(編號)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='認證憑證表 - 管理使用者的登入 Token';

-- =============================================
-- 3. 收藏幣種表
-- =============================================
-- 說明：儲存使用者收藏的加密貨幣（Watchlist 功能）
-- 功能：收藏管理、追蹤清單、快速存取常用幣種
-- =============================================
CREATE TABLE IF NOT EXISTS 收藏幣種 (
    -- 主鍵
    編號 BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '收藏記錄唯一識別碼',

    -- 關聯資料
    使用者編號 BIGINT UNSIGNED NOT NULL COMMENT '使用者 ID',
    幣種編號 VARCHAR(64) NOT NULL COMMENT 'CoinGecko 幣種 ID（例如：bitcoin, ethereum, cardano）',

    -- 時間記錄
    建立時間 DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '收藏時間',

    -- 索引與約束
    UNIQUE KEY 唯一鍵_使用者幣種 (使用者編號, 幣種編號) COMMENT '防止重複收藏同一幣種',
    INDEX 索引_使用者編號 (使用者編號) COMMENT '加速查詢使用者的收藏列表',
    INDEX 索引_幣種編號 (幣種編號) COMMENT '加速統計幣種的收藏次數',

    -- 外鍵約束（使用者刪除時，同步刪除其所有收藏）
    CONSTRAINT 外鍵_收藏幣種_使用者編號
        FOREIGN KEY (使用者編號) REFERENCES 使用者(編號)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='收藏幣種表 - 使用者的 Watchlist 功能';

-- =============================================
-- 4. 系統公告表
-- =============================================
-- 說明：儲存管理員發布的系統公告
-- 功能：公告管理、通知使用者重要訊息、平台消息發布
-- =============================================
CREATE TABLE IF NOT EXISTS 系統公告 (
    -- 主鍵
    編號 BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '公告唯一識別碼',

    -- 公告內容
    標題 VARCHAR(200) NOT NULL COMMENT '公告標題',
    內容 TEXT NOT NULL COMMENT '公告內容（支援較長文字）',
    類型 ENUM('info', 'success', 'warning') NOT NULL DEFAULT 'info'
        COMMENT '公告類型：info=一般資訊（藍色）, success=成功消息（綠色）, warning=警告訊息（黃色）',

    -- 狀態管理
    是否啟用 BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否啟用：true=顯示給使用者, false=已停用',

    -- 關聯資料
    建立者編號 BIGINT UNSIGNED NOT NULL COMMENT '建立此公告的管理員 ID',

    -- 時間記錄
    建立時間 DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '公告建立時間',
    更新時間 DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '公告更新時間',

    -- 索引
    INDEX 索引_是否啟用 (是否啟用) COMMENT '加速查詢啟用中的公告',
    INDEX 索引_建立時間 (建立時間) COMMENT '支援依時間排序',
    INDEX 索引_建立者 (建立者編號) COMMENT '查詢特定管理員發布的公告',

    -- 外鍵約束（管理員刪除時，同步刪除其發布的公告）
    CONSTRAINT 外鍵_系統公告_建立者
        FOREIGN KEY (建立者編號) REFERENCES 使用者(編號)
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
-- INSERT INTO 使用者 (使用者名稱, 電子信箱, 密碼加密值, 角色, 註冊日期) VALUES
-- ('admin', 'admin@example.com', '$2b$10$YOUR_BCRYPT_HASH_HERE', 'admin', NOW());

-- 建立測試用戶
-- 帳號：demo@example.com
-- 密碼：password（請使用 BCrypt 加密後替換 YOUR_BCRYPT_HASH_HERE）
-- INSERT INTO 使用者 (使用者名稱, 電子信箱, 密碼加密值, 角色, 註冊日期) VALUES
-- ('demo_user', 'demo@example.com', '$2b$10$YOUR_BCRYPT_HASH_HERE', 'user', NOW());

-- =============================================
-- 維護說明
-- =============================================
-- 1. 定期清理過期 Token：
--    DELETE FROM 登入憑證 WHERE 過期時間 < NOW();
--
-- 2. 查詢活躍使用者（7天內登入）：
--    SELECT * FROM 使用者 WHERE 最後登入時間 > DATE_SUB(NOW(), INTERVAL 7 DAY);
--
-- 3. 統計最多收藏的幣種：
--    SELECT 幣種編號, COUNT(*) as 收藏次數
--    FROM 收藏幣種
--    GROUP BY 幣種編號
--    ORDER BY 收藏次數 DESC
--    LIMIT 10;
--
-- 4. 查詢啟用中的公告：
--    SELECT a.*, u.使用者名稱 as 建立者名稱
--    FROM 系統公告 a
--    JOIN 使用者 u ON a.建立者編號 = u.編號
--    WHERE a.是否啟用 = TRUE
--    ORDER BY a.建立時間 DESC;

-- =============================================
-- 資料庫關聯圖（ER Diagram 文字說明）
-- =============================================
-- 使用者 (1) ─── (N) 登入憑證
--   └─ 使用者編號
--
-- 使用者 (1) ─── (N) 收藏幣種
--   └─ 使用者編號
--
-- 使用者 (1) ─── (N) 系統公告
--   └─ 建立者編號

-- =============================================
-- 對照說明
-- =============================================
-- 此檔案為完全中文化版本，對照 schema.sql（英文版）：
--
-- 表名對照：
-- - 使用者 (users)
-- - 登入憑證 (auth_tokens)
-- - 收藏幣種 (coin_favorites)
-- - 系統公告 (announcements)
--
-- 常用欄位對照：
-- - 編號 (id)
-- - 使用者編號 (user_id)
-- - 使用者名稱 (username)
-- - 電子信箱 (email)
-- - 密碼加密值 (password_hash)
-- - 憑證 (token)
-- - 建立時間 (created_at)
-- - 更新時間 (updated_at)
--
-- 注意：實際部署時建議使用 schema.sql（英文版），
--      因為程式碼中的 SQL 查詢和 ORM 對應會更容易維護。
--      此中文版主要用於學習和對照參考。
