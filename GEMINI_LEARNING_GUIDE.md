# CoinVue（幣景）完整開發學習指南 - Gemini 引導式學習版

> 這是一份專為 Gemini AI 引導式學習功能設計的完整專案開發指南。
> 請將此文檔提供給 Gemini，讓它手把手帶你從零開始完成整個專案。

---

## 📌 給 Gemini AI 的指示

親愛的 Gemini，請根據以下學習路徑，**手把手、循序漸進**地引導學習者完成 CoinVue（幣景）專案。

### 你的角色定位
你是一位經驗豐富的全端開發導師，需要：
1. **逐步教學**：每次只教一個小步驟，確保學習者理解後再繼續
2. **詳細解釋**：解釋每段代碼的作用、為什麼這樣寫、有什麼替代方案
3. **主動提問**：定期檢查學習者的理解程度
4. **提供示例**：給出完整的代碼範例，並標註重點
5. **錯誤處理**：預測可能遇到的問題，提前說明解決方案
6. **最佳實踐**：在適當時機介紹業界最佳實踐和設計模式

### 教學節奏
- 每個步驟完成後，詢問學習者：「這部分理解了嗎？有沒有問題？」
- 確認理解後才進入下一步
- 如果學習者遇到困難，提供更詳細的解釋和替代方案
- 定期回顧已完成的部分，確保知識連貫

---

## 🎯 專案概述

### 專案名稱
**CoinVue（幣景）** - 專業的加密貨幣市場監控平台

### 專案目標
打造一個全功能的加密貨幣儀表板，包含：
- 即時價格追蹤
- 市場總覽與進階篩選
- 個人收藏清單（Watchlist）
- 幣種比較工具
- 用戶認證系統（JWT）
- 管理員後台（統計、用戶管理、公告系統）

### 技術棧總覽

**前端**
- Vue 3.5.22 - 現代化的漸進式 JavaScript 框架
- Vite 7.1.11 - 極速的前端建構工具
- Pinia 3.0.3 - Vue 官方推薦的狀態管理工具
- Vue Router 4.6.3 - 官方路由管理
- vue-i18n 9.14.5 - 國際化（中英文雙語）

**後端**
- Spring Boot 3.2.0 - Java 企業級框架
- Spring Security - 安全框架（JWT 認證）
- Spring Data JPA - ORM 框架（Hibernate）
- MySQL 8.0 - 關聯式資料庫
- Maven 3.8+ - 專案管理工具

**API 數據源**
- CoinGecko API - 主要數據來源（30 次/分鐘）
- CoinCap API - 備援數據來源（200 次/分鐘）

### 學習時程預估
- **總時長**：約 80-100 小時（12-15 週）
- **每週建議**：6-8 小時學習時間
- **難度**：中高級（需要基礎的前端和後端知識）

---

## 📚 學習路徑規劃（15 週）

### 第一階段：環境準備與基礎認識（第 1-2 週）
### 第二階段：後端基礎建設（第 3-5 週）
### 第三階段：前端基礎建設（第 6-8 週）
### 第四階段：前後端整合（第 9-10 週）
### 第五階段：進階功能實作（第 11-13 週）
### 第六階段：優化與部署（第 14-15 週）

---

## 🚀 第一階段：環境準備與基礎認識（第 1-2 週）

### Week 1, Day 1-2：開發環境安裝

#### 目標
安裝所有必要的開發工具

#### 需要安裝的工具

**1. Node.js 與 npm**
- 下載：https://nodejs.org/（選擇 LTS 版本）
- 驗證安裝：
  ```bash
  node -v  # 應顯示 v18.x.x 或更高版本
  npm -v   # 應顯示 9.x.x 或更高版本
  ```

**2. Java Development Kit (JDK) 17**
- 下載：https://adoptium.net/（選擇 JDK 17 LTS）
- 驗證安裝：
  ```bash
  java -version  # 應顯示 openjdk version "17.x.x"
  ```

**3. Maven**
- Windows 用戶：
  ```bash
  choco install maven -y  # 需先安裝 Chocolatey
  ```
- Mac 用戶：
  ```bash
  brew install maven
  ```
- 驗證安裝：
  ```bash
  mvn -v  # 應顯示 Apache Maven 3.8.x
  ```

**4. MySQL 8.0**
- 下載：https://dev.mysql.com/downloads/mysql/
- 安裝過程中設定 root 密碼（請記住這個密碼）
- 驗證安裝：
  ```bash
  mysql --version  # 應顯示 mysql Ver 8.0.x
  ```

**5. IDE / 編輯器**
- **前端推薦**：VS Code（https://code.visualstudio.com/）
  - 安裝擴充套件：Vue Language Features (Volar)、ESLint、Prettier
- **後端推薦**：Eclipse（https://www.eclipse.org/downloads/）或 IntelliJ IDEA

**6. Git**
- 下載：https://git-scm.com/
- 驗證安裝：
  ```bash
  git --version
  ```

**7. Postman（選擇性）**
- 下載：https://www.postman.com/downloads/
- 用於測試 API（專案已整合 Swagger UI，可替代）

#### 學習檢查點
- [ ] 所有工具安裝完成
- [ ] 可以在終端機執行 node、java、mvn、mysql 指令
- [ ] IDE 可以正常開啟

**Gemini 提示**：請逐一確認學習者是否成功安裝每個工具，遇到問題時提供解決方案。

---

### Week 1, Day 3-4：專案初始化

#### 目標
建立專案資料夾結構，初始化前後端專案

#### 步驟 1：建立專案根目錄

```bash
# 在你的工作目錄下建立專案資料夾
mkdir CryptoDashboard
cd CryptoDashboard
```

#### 步驟 2：初始化 Git

```bash
git init
echo "node_modules/" > .gitignore
echo "target/" >> .gitignore
echo ".env" >> .gitignore
echo "*.log" >> .gitignore
```

#### 步驟 3：建立專案結構

```bash
# 建立主要資料夾
mkdir frontend
mkdir backend
mkdir database
mkdir docs
```

最終結構應如下：
```
CryptoDashboard/
├── frontend/      # Vue 3 前端專案
├── backend/       # Spring Boot 後端專案
├── database/      # MySQL 資料庫腳本
├── docs/          # 專案文檔
└── .gitignore
```

#### 步驟 4：初始化前端專案

```bash
cd frontend

# 使用 Vite 建立 Vue 3 專案
npm create vite@latest . -- --template vue

# 安裝依賴
npm install

# 測試運行
npm run dev
```

訪問 http://localhost:5173，應該會看到 Vite + Vue 的歡迎頁面。

#### 步驟 5：安裝前端依賴套件

```bash
# 核心依賴
npm install vue-router@4 pinia@2 axios@1

# 國際化
npm install vue-i18n@9

# 工具函數
npm install date-fns@2
```

#### 步驟 6：初始化後端專案（使用 Spring Initializr）

方式 A：使用網頁版
1. 訪問 https://start.spring.io/
2. 設定專案：
   - Project: Maven
   - Language: Java
   - Spring Boot: 3.2.0
   - Group: com.crypto
   - Artifact: dashboard
   - Packaging: Jar
   - Java: 17
3. 新增依賴：
   - Spring Web
   - Spring Data JPA
   - Spring Security
   - MySQL Driver
   - Lombok
4. 點擊 Generate，下載 zip 檔
5. 解壓縮到 `backend/` 資料夾

方式 B：使用 Spring Boot CLI（進階）
```bash
spring init --dependencies=web,data-jpa,security,mysql,lombok \
  --build=maven --java-version=17 --boot-version=3.2.0 \
  --groupId=com.crypto --artifactId=dashboard \
  backend
```

#### 學習檢查點
- [ ] 專案資料夾結構正確
- [ ] 前端可以運行（http://localhost:5173）
- [ ] 後端專案資料夾存在且包含 pom.xml

**Gemini 提示**：確認學習者的專案結構正確，前端可以正常啟動。

---

### Week 1, Day 5-7：核心概念學習

#### 目標
理解專案中使用的核心技術和概念

#### 必須理解的前端概念

**1. Vue 3 Composition API**
- 什麼是 Composition API？與 Options API 的差異？
- `setup()` 函數的作用
- `ref` 和 `reactive` 的差異
- `computed` 和 `watch` 的使用時機

**學習資源**：
- Vue 3 官方文檔：https://vuejs.org/guide/introduction.html
- 重點閱讀：Essentials、Reactivity、Components In-Depth

**2. Pinia 狀態管理**
- 為什麼需要狀態管理？
- Pinia 的 Store 是什麼？
- `state`、`getters`、`actions` 的作用
- 如何在元件中使用 Store？

**學習資源**：
- Pinia 官方文檔：https://pinia.vuejs.org/introduction.html

**3. Vue Router**
- 什麼是單頁面應用（SPA）？
- 路由配置的基本結構
- 動態路由參數（如 `/coin/:id`）
- 路由守衛（Navigation Guards）的作用

**學習資源**：
- Vue Router 官方文檔：https://router.vuejs.org/guide/

#### 必須理解的後端概念

**1. Spring Boot 基礎**
- 什麼是 Spring Boot？與傳統 Spring 的差異？
- 依賴注入（Dependency Injection）是什麼？
- `@Component`、`@Service`、`@Controller` 的差異
- `application.yml` 配置檔的作用

**學習資源**：
- Spring Boot 官方指南：https://spring.io/guides/gs/spring-boot/

**2. JPA/Hibernate**
- ORM（Object-Relational Mapping）是什麼？
- JPA Entity 類別的作用
- `@Entity`、`@Id`、`@GeneratedValue` 等註解的意義
- JPA Repository 的基本使用

**學習資源**：
- Spring Data JPA 指南：https://spring.io/guides/gs/accessing-data-jpa/

**3. Spring Security + JWT**
- 什麼是 JWT（JSON Web Token）？
- 為什麼不使用傳統的 Session？
- JWT 的結構（Header、Payload、Signature）
- Bearer Token 是什麼？

**學習資源**：
- JWT 官網：https://jwt.io/introduction

**4. RESTful API 設計原則**
- REST 的基本概念
- HTTP 方法（GET、POST、PUT、DELETE）的使用時機
- HTTP 狀態碼（200、201、400、401、404、500）的意義
- API 端點命名規範

**學習資源**：
- RESTful API 設計指南：https://restfulapi.net/

#### 學習作業

**作業 1：建立一個簡單的 Vue 3 元件**
目標：熟悉 Composition API

```vue
<!-- 建立 frontend/src/components/HelloWorld.vue -->
<template>
  <div>
    <h1>{{ message }}</h1>
    <p>計數器: {{ count }}</p>
    <button @click="increment">增加</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('Hello, CoinVue!')
const count = ref(0)

const increment = () => {
  count.value++
}
</script>

<style scoped>
button {
  padding: 10px 20px;
  font-size: 16px;
}
</style>
```

**作業 2：建立一個簡單的 Spring Boot Controller**
目標：理解 REST API 的基本結構

```java
// 建立 backend/src/main/java/com/crypto/dashboard/controller/TestController.java
package com.crypto.dashboard.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello from Spring Boot!";
    }

    @GetMapping("/echo/{message}")
    public String echo(@PathVariable String message) {
        return "Echo: " + message;
    }
}
```

#### 學習檢查點
- [ ] 理解 Vue 3 Composition API 的基本概念
- [ ] 理解 Pinia 狀態管理的作用
- [ ] 理解 Spring Boot 三層架構（Controller、Service、Repository）
- [ ] 理解 JWT 認證的基本原理
- [ ] 理解 RESTful API 設計規範

**Gemini 提示**：
- 用簡單的比喻解釋這些概念
- 確認學習者理解每個概念的「為什麼」，而不只是「怎麼做」
- 鼓勵學習者完成作業並親自測試

---

### Week 2：資料庫設計與建立

#### 目標
理解資料庫設計原則，建立 MySQL 資料庫

#### Day 1-2：資料庫設計理論

**學習重點**
1. **正規化（Normalization）**
   - 第一正規化（1NF）：每個欄位都是原子性的
   - 第二正規化（2NF）：消除部分相依
   - 第三正規化（3NF）：消除遞移相依

2. **主鍵（Primary Key）**
   - 自動遞增 ID vs UUID
   - 本專案選擇：AUTO_INCREMENT BIGINT

3. **外鍵（Foreign Key）**
   - 建立表格之間的關聯
   - CASCADE DELETE 的作用

4. **索引（Index）**
   - 提升查詢效能
   - 適合建立索引的欄位（常用於 WHERE、JOIN 的欄位）

#### Day 3-5：建立資料庫結構

**步驟 1：建立資料庫腳本**

建立檔案 `database/schema_v3.sql`：

```sql
-- ============================================
-- CoinVue（幣景）資料庫結構 v3.0
-- ============================================

-- 建立資料庫
CREATE DATABASE IF NOT EXISTS crypto_dashboard
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE crypto_dashboard;

-- ============================================
-- 核心表格（v1.0）
-- ============================================

-- 1. users 表 - 使用者資料
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    preferred_language VARCHAR(10) DEFAULT 'zh-TW',
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. auth_tokens 表 - JWT Token 管理
CREATE TABLE auth_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_valid BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. coin_favorites 表 - 收藏清單
CREATE TABLE coin_favorites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    coin_id VARCHAR(50) NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_coin (user_id, coin_id),
    INDEX idx_user_id (user_id),
    INDEX idx_coin_id (coin_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. announcements 表 - 系統公告
CREATE TABLE announcements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    type ENUM('info', 'success', 'warning') DEFAULT 'info',
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 擴充表格（v3.0 - 未來功能）
-- ============================================

-- 5. user_activities 表 - 用戶活動記錄
CREATE TABLE user_activities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    activity_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_activity_type (activity_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. market_filter_presets 表 - 市場篩選預設
CREATE TABLE market_filter_presets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    preset_name VARCHAR(100) NOT NULL,
    filter_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. coin_price_alerts 表 - 價格提醒
CREATE TABLE coin_price_alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    coin_id VARCHAR(50) NOT NULL,
    target_price DECIMAL(20, 8) NOT NULL,
    condition_type ENUM('above', 'below') NOT NULL,
    is_triggered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    triggered_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_coin_id (coin_id),
    INDEX idx_is_triggered (is_triggered)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. coin_comparisons 表 - 幣種比較歷史
CREATE TABLE coin_comparisons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    coin_ids JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. system_settings 表 - 系統設定
CREATE TABLE system_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    description VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_setting_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**步驟 2：執行資料庫腳本**

```bash
# 連接 MySQL 並執行腳本
mysql -u root -p < database/schema_v3.sql

# 驗證資料庫建立成功
mysql -u root -p -e "USE crypto_dashboard; SHOW TABLES;"
```

應該會看到 9 個表格。

**步驟 3：理解表格關聯**

```
users (1) ----< (N) auth_tokens      # 一個用戶可以有多個 Token
users (1) ----< (N) coin_favorites   # 一個用戶可以收藏多個幣種
users (1) ----< (N) announcements    # 一個用戶（管理員）可以建立多個公告
```

#### 學習檢查點
- [ ] 理解資料庫正規化的基本概念
- [ ] 理解主鍵和外鍵的作用
- [ ] 成功建立資料庫並驗證表格存在
- [ ] 理解各表格之間的關聯關係

**Gemini 提示**：
- 用圖表解釋表格關聯
- 解釋為什麼需要這樣設計（例如：為什麼需要 auth_tokens 表？）
- 確認學習者理解 CASCADE DELETE 的作用

---

## 🔧 第二階段：後端基礎建設（第 3-5 週）

### Week 3：Entity 層與 Repository 層

#### 目標
建立 JPA Entity 類別和資料存取層

#### Day 1-2：配置後端基礎設定

**步驟 1：配置 pom.xml**

編輯 `backend/pom.xml`，確保包含以下依賴：

```xml
<dependencies>
    <!-- Spring Boot Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Spring Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- Spring Security -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>

    <!-- MySQL Driver -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>

    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>

    <!-- Caffeine Cache -->
    <dependency>
        <groupId>com.github.ben-manes.caffeine</groupId>
        <artifactId>caffeine</artifactId>
    </dependency>

    <!-- Swagger/OpenAPI -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.2.0</version>
    </dependency>

    <!-- Validation -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
</dependencies>
```

**步驟 2：建立 application.yml**

建立 `backend/src/main/resources/application.yml`：

```yaml
spring:
  application:
    name: CoinVue Backend

  datasource:
    url: jdbc:mysql://localhost:3306/crypto_dashboard?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: root
    password: your_mysql_password  # 改成你的 MySQL 密碼
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: validate  # 不自動建立表格，使用已存在的資料庫結構
    show-sql: true        # 顯示 SQL 語句（開發時有用）
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.MySQL8Dialect

  cache:
    type: caffeine
    caffeine:
      spec: maximumSize=1000,expireAfterWrite=300s

server:
  port: 8080
  servlet:
    context-path: /api

# JWT 配置
jwt:
  secret: coinvue-secret-key-minimum-32-characters-required-for-hs512
  expiration: 86400000  # 24 小時（毫秒）

# CoinGecko API 配置
coingecko:
  api:
    key: CG-vczvnvBTsqG7Z8EVB7KRb3ii
    base-url: https://api.coingecko.com/api/v3

# CORS 配置
cors:
  allowed-origins: http://localhost:5173
  allowed-methods: GET,POST,PUT,DELETE,OPTIONS
  allowed-headers: "*"
  allow-credentials: true

# Logging
logging:
  level:
    com.crypto.dashboard: DEBUG
    org.hibernate.SQL: DEBUG
```

**步驟 3：建立開發環境配置**

建立 `backend/src/main/resources/application-dev.yml`：

```yaml
spring:
  datasource:
    password: your_mysql_password  # 開發環境的 MySQL 密碼

logging:
  level:
    root: INFO
    com.crypto.dashboard: DEBUG
```

#### Day 3-5：建立 Entity 類別

**建立資料夾結構**

```
backend/src/main/java/com/crypto/dashboard/
├── entity/        # 實體類別
├── repository/    # 資料存取層
├── service/       # 業務邏輯層
├── controller/    # API 控制器
├── dto/           # 資料傳輸物件
├── config/        # 配置類別
├── exception/     # 例外處理
└── util/          # 工具類別
```

**Entity 1: User.java**

建立 `backend/src/main/java/com/crypto/dashboard/entity/User.java`：

```java
package com.crypto.dashboard.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role = UserRole.USER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserStatus status = UserStatus.ACTIVE;

    @Column(name = "preferred_language", length = 10)
    private String preferredLanguage = "zh-TW";

    @Column(name = "join_date", nullable = false, updatable = false)
    private LocalDateTime joinDate = LocalDateTime.now();

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    // 枚舉類型
    public enum UserRole {
        USER, ADMIN
    }

    public enum UserStatus {
        ACTIVE, INACTIVE, SUSPENDED
    }
}
```

**重點解釋**：
- `@Entity`：標記這是一個 JPA 實體類別，會對應到資料庫的表格
- `@Table(name = "users")`：指定對應的表格名稱
- `@Id`：標記主鍵
- `@GeneratedValue`：主鍵自動生成策略
- `@Column`：對應資料庫欄位，可設定限制條件
- `@Enumerated(EnumType.STRING)`：將 enum 以字串形式儲存（而非整數）
- `@Getter/@Setter`：Lombok 自動生成 getter/setter 方法

**Entity 2: AuthToken.java**

建立 `backend/src/main/java/com/crypto/dashboard/entity/AuthToken.java`：

```java
package com.crypto.dashboard.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "auth_tokens")
@Getter
@Setter
public class AuthToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, unique = true, length = 500)
    private String token;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "is_valid", nullable = false)
    private Boolean isValid = true;
}
```

**重點解釋**：
- `@ManyToOne`：多對一關聯（多個 Token 屬於一個 User）
- `fetch = FetchType.LAZY`：延遲載入，只在需要時才查詢關聯的 User
- `@JoinColumn`：指定外鍵欄位

**Entity 3: CoinFavorite.java**

建立 `backend/src/main/java/com/crypto/dashboard/entity/CoinFavorite.java`：

```java
package com.crypto.dashboard.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "coin_favorites",
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"user_id", "coin_id"}
    )
)
@Getter
@Setter
public class CoinFavorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "coin_id", nullable = false, length = 50)
    private String coinId;

    @Column(name = "added_at", nullable = false, updatable = false)
    private LocalDateTime addedAt = LocalDateTime.now();
}
```

**重點解釋**：
- `@UniqueConstraint`：確保一個用戶不會重複收藏同一個幣種

**Entity 4: Announcement.java**

建立 `backend/src/main/java/com/crypto/dashboard/entity/Announcement.java`：

```java
package com.crypto.dashboard.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "announcements")
@Getter
@Setter
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AnnouncementType type = AnnouncementType.INFO;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // 枚舉類型
    public enum AnnouncementType {
        INFO, SUCCESS, WARNING
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

**重點解釋**：
- `@PreUpdate`：JPA 生命週期回調，在更新前自動執行

#### Day 6-7：建立 Repository 層

**Repository 1: UserRepository.java**

建立 `backend/src/main/java/com/crypto/dashboard/repository/UserRepository.java`：

```java
package com.crypto.dashboard.repository;

import com.crypto.dashboard.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // 根據 email 查詢用戶
    Optional<User> findByEmail(String email);

    // 根據 username 查詢用戶
    Optional<User> findByUsername(String username);

    // 檢查 email 是否已存在
    boolean existsByEmail(String email);

    // 檢查 username 是否已存在
    boolean existsByUsername(String username);

    // 查詢活躍用戶數（7天內登入）
    @Query("SELECT COUNT(u) FROM User u WHERE u.lastLogin >= :since")
    long countActiveUsers(LocalDateTime since);

    // 查詢所有用戶（含收藏數統計）
    @Query("SELECT u, COUNT(f.id) as favoriteCount " +
           "FROM User u LEFT JOIN CoinFavorite f ON u.id = f.user.id " +
           "GROUP BY u.id")
    Object[][] findAllWithFavoriteCount();
}
```

**重點解釋**：
- `JpaRepository<User, Long>`：繼承 JPA 的基礎 Repository，提供基本 CRUD 方法
  - `User`：實體類型
  - `Long`：主鍵類型
- Spring Data JPA 會根據方法名自動生成 SQL（如 `findByEmail`）
- `@Query`：自訂 JPQL 查詢語句

**Repository 2: AuthTokenRepository.java**

建立 `backend/src/main/java/com/crypto/dashboard/repository/AuthTokenRepository.java`：

```java
package com.crypto.dashboard.repository;

import com.crypto.dashboard.entity.AuthToken;
import com.crypto.dashboard.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface AuthTokenRepository extends JpaRepository<AuthToken, Long> {

    // 根據 token 字串查詢
    Optional<AuthToken> findByToken(String token);

    // 刪除用戶的所有 Token
    @Modifying
    @Transactional
    void deleteByUser_Id(Long userId);

    // 刪除已過期的 Token
    @Modifying
    @Transactional
    @Query("DELETE FROM AuthToken a WHERE a.expiresAt < :now")
    void deleteExpiredTokens(LocalDateTime now);
}
```

**重點解釋**：
- `@Modifying`：標記這是一個修改操作（INSERT、UPDATE、DELETE）
- `@Transactional`：開啟交易管理，確保資料一致性
- `deleteByUser_Id`：根據關聯實體的屬性刪除（注意是 `User_Id`，不是 `UserId`）

**Repository 3: CoinFavoriteRepository.java**

建立 `backend/src/main/java/com/crypto/dashboard/repository/CoinFavoriteRepository.java`：

```java
package com.crypto.dashboard.repository;

import com.crypto.dashboard.entity.CoinFavorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface CoinFavoriteRepository extends JpaRepository<CoinFavorite, Long> {

    // 查詢用戶的所有收藏
    List<CoinFavorite> findByUser_Id(Long userId);

    // 查詢用戶是否已收藏某幣種
    Optional<CoinFavorite> findByUser_IdAndCoinId(Long userId, String coinId);

    // 檢查用戶是否已收藏某幣種
    boolean existsByUser_IdAndCoinId(Long userId, String coinId);

    // 刪除用戶的某個收藏
    @Modifying
    @Transactional
    void deleteByUser_IdAndCoinId(Long userId, String coinId);

    // 刪除用戶的所有收藏
    @Modifying
    @Transactional
    void deleteByUser_Id(Long userId);

    // 查詢總收藏數
    @Query("SELECT COUNT(f) FROM CoinFavorite f")
    long countAllFavorites();

    // 查詢最多收藏的幣種排行（使用原生 SQL）
    @Query(value = "SELECT coin_id, COUNT(*) as count " +
                   "FROM coin_favorites " +
                   "GROUP BY coin_id " +
                   "ORDER BY count DESC " +
                   "LIMIT ?1",
           nativeQuery = true)
    List<Object[]> findTopFavoriteCoins(int limit);
}
```

**重點解釋**：
- `nativeQuery = true`：使用原生 SQL（因為 JPQL 不支援 LIMIT 語法）

**Repository 4: AnnouncementRepository.java**

建立 `backend/src/main/java/com/crypto/dashboard/repository/AnnouncementRepository.java`：

```java
package com.crypto.dashboard.repository;

import com.crypto.dashboard.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    // 查詢所有啟用的公告（按建立時間降序）
    List<Announcement> findByIsActiveTrueOrderByCreatedAtDesc();

    // 查詢所有公告（按建立時間降序）
    List<Announcement> findAllByOrderByCreatedAtDesc();
}
```

#### 學習檢查點
- [ ] 理解 JPA Entity 的註解用法
- [ ] 理解 JPA Repository 的方法命名規則
- [ ] 成功建立 4 個 Entity 和 4 個 Repository
- [ ] 理解 `@ManyToOne` 關聯的作用

**Gemini 提示**：
- 解釋為什麼使用 `FetchType.LAZY` 而不是 `EAGER`
- 解釋 `@Modifying` 和 `@Transactional` 的重要性
- 確認學習者理解 Repository 方法命名規則（如 `findByUser_Id`）

---

### Week 4：Service 層與 JWT 認證

#### 目標
實作業務邏輯層和 JWT 認證系統

#### Day 1-2：建立 JWT 工具類

**步驟 1：建立 JwtUtil.java**

建立 `backend/src/main/java/com/crypto/dashboard/util/JwtUtil.java`：

```java
package com.crypto.dashboard.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    // 生成 JWT Token
    public String generateToken(Long userId, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .setSubject(userId.toString())
                .claim("role", role)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    // 從 Token 取得 User ID
    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return Long.parseLong(claims.getSubject());
    }

    // 從 Token 取得角色
    public String getRoleFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("role", String.class);
    }

    // 驗證 Token 是否有效
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // 取得簽名密鑰
    private Key getSigningKey() {
        byte[] keyBytes = secret.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
```

**重點解釋**：
- `@Component`：將類別註冊為 Spring Bean，可被注入到其他類別
- `@Value`：從 application.yml 讀取配置
- `setSubject()`：設定 JWT 的主體（通常是用戶 ID）
- `claim()`：添加自訂欄位（如角色）
- `SignatureAlgorithm.HS512`：使用 HMAC-SHA512 演算法簽名

#### Day 3-4：建立 DTO 類別

**DTO 1: 登入請求**

建立 `backend/src/main/java/com/crypto/dashboard/dto/LoginRequest.java`：

```java
package com.crypto.dashboard.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Email 不能為空")
    @Email(message = "Email 格式不正確")
    private String email;

    @NotBlank(message = "密碼不能為空")
    private String password;
}
```

**重點解釋**：
- `@Data`：Lombok 自動生成 getter、setter、toString 等方法
- `@NotBlank`：驗證欄位不能為空
- `@Email`：驗證 Email 格式

**DTO 2: 註冊請求**

建立 `backend/src/main/java/com/crypto/dashboard/dto/RegisterRequest.java`：

```java
package com.crypto.dashboard.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "用戶名不能為空")
    @Size(min = 3, max = 50, message = "用戶名長度必須在 3-50 字元之間")
    private String username;

    @NotBlank(message = "Email 不能為空")
    @Email(message = "Email 格式不正確")
    private String email;

    @NotBlank(message = "密碼不能為空")
    @Size(min = 6, max = 100, message = "密碼長度必須在 6-100 字元之間")
    private String password;
}
```

**DTO 3: 認證回應**

建立 `backend/src/main/java/com/crypto/dashboard/dto/AuthResponse.java`：

```java
package com.crypto.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UserDTO user;

    @Data
    @AllArgsConstructor
    public static class UserDTO {
        private Long id;
        private String username;
        private String email;
        private String role;
        private String status;
    }
}
```

#### Day 5-7：建立 Service 層

**Service 1: AuthService.java**

建立 `backend/src/main/java/com/crypto/dashboard/service/AuthService.java`：

```java
package com.crypto.dashboard.service;

import com.crypto.dashboard.dto.AuthResponse;
import com.crypto.dashboard.dto.LoginRequest;
import com.crypto.dashboard.dto.RegisterRequest;
import com.crypto.dashboard.entity.AuthToken;
import com.crypto.dashboard.entity.User;
import com.crypto.dashboard.exception.DuplicateUserException;
import com.crypto.dashboard.exception.InvalidCredentialsException;
import com.crypto.dashboard.repository.AuthTokenRepository;
import com.crypto.dashboard.repository.UserRepository;
import com.crypto.dashboard.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AuthTokenRepository authTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // 用戶註冊
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // 檢查 email 是否已存在
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateUserException("Email 已被註冊");
        }

        // 檢查 username 是否已存在
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateUserException("用戶名已被使用");
        }

        // 建立新用戶
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.UserRole.USER);  // 預設角色為 USER
        user.setStatus(User.UserStatus.ACTIVE);

        user = userRepository.save(user);

        // 簽發 JWT Token
        return issueToken(user);
    }

    // 用戶登入
    @Transactional
    public AuthResponse login(LoginRequest request) {
        // 查詢用戶
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Email 或密碼錯誤"));

        // 驗證密碼
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Email 或密碼錯誤");
        }

        // 更新最後登入時間
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // 刪除舊 Token（可選）
        authTokenRepository.deleteByUser_Id(user.getId());

        // 簽發 JWT Token
        return issueToken(user);
    }

    // 用戶登出
    @Transactional
    public void logout(String token) {
        authTokenRepository.findByToken(token)
                .ifPresent(authTokenRepository::delete);
    }

    // 簽發 Token（私有方法）
    private AuthResponse issueToken(User user) {
        // 生成 JWT
        String token = jwtUtil.generateToken(user.getId(), user.getRole().name());

        // 儲存到資料庫
        AuthToken authToken = new AuthToken();
        authToken.setUser(user);
        authToken.setToken(token);
        authToken.setExpiresAt(LocalDateTime.now().plusDays(1));
        authTokenRepository.save(authToken);

        // 返回回應
        return new AuthResponse(
            token,
            new AuthResponse.UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name().toLowerCase(),
                user.getStatus().name().toLowerCase()
            )
        );
    }
}
```

**重點解釋**：
- `@Service`：標記為業務邏輯層
- `@RequiredArgsConstructor`：Lombok 自動生成包含所有 final 欄位的建構子（實現依賴注入）
- `@Transactional`：開啟交易管理
- `passwordEncoder.encode()`：使用 BCrypt 加密密碼
- `passwordEncoder.matches()`：驗證密碼

**Service 2: FavoriteService.java**

建立 `backend/src/main/java/com/crypto/dashboard/service/FavoriteService.java`：

```java
package com.crypto.dashboard.service;

import com.crypto.dashboard.entity.CoinFavorite;
import com.crypto.dashboard.entity.User;
import com.crypto.dashboard.exception.DuplicateFavoriteException;
import com.crypto.dashboard.exception.ResourceNotFoundException;
import com.crypto.dashboard.repository.CoinFavoriteRepository;
import com.crypto.dashboard.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final CoinFavoriteRepository coinFavoriteRepository;
    private final UserRepository userRepository;

    // 取得用戶的所有收藏
    public List<String> getFavorites(Long userId) {
        return coinFavoriteRepository.findByUser_Id(userId)
                .stream()
                .map(CoinFavorite::getCoinId)
                .collect(Collectors.toList());
    }

    // 新增收藏
    @Transactional
    public void addFavorite(Long userId, String coinId) {
        // 檢查是否已收藏
        if (coinFavoriteRepository.existsByUser_IdAndCoinId(userId, coinId)) {
            throw new DuplicateFavoriteException("已經收藏過此幣種");
        }

        // 從資料庫載入 User 實體
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("用戶不存在"));

        // 建立收藏記錄
        CoinFavorite favorite = new CoinFavorite();
        favorite.setUser(user);
        favorite.setCoinId(coinId);

        coinFavoriteRepository.save(favorite);
    }

    // 移除收藏
    @Transactional
    public void removeFavorite(Long userId, String coinId) {
        if (!coinFavoriteRepository.existsByUser_IdAndCoinId(userId, coinId)) {
            throw new ResourceNotFoundException("收藏不存在");
        }

        coinFavoriteRepository.deleteByUser_IdAndCoinId(userId, coinId);
    }

    // 清空所有收藏
    @Transactional
    public void clearFavorites(Long userId) {
        coinFavoriteRepository.deleteByUser_Id(userId);
    }
}
```

#### 學習檢查點
- [ ] 理解 JWT 的生成和驗證流程
- [ ] 理解 DTO 的作用（資料傳輸物件）
- [ ] 理解 Service 層的職責（業務邏輯）
- [ ] 理解密碼加密的重要性

**Gemini 提示**：
- 解釋為什麼不能直接傳輸 Entity，而要使用 DTO
- 解釋為什麼需要 `@Transactional`
- 解釋 BCrypt 加密的原理

---

---

### Week 5：Controller 層與 Security 配置

#### 目標
實作 REST API 控制器和 Spring Security 配置

#### Day 1-2：建立例外處理

**步驟 1：建立自訂例外類別**

建立 `backend/src/main/java/com/crypto/dashboard/exception/` 資料夾，並建立以下例外類別：

```java
// ResourceNotFoundException.java
package com.crypto.dashboard.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

// DuplicateUserException.java
package com.crypto.dashboard.exception;

public class DuplicateUserException extends RuntimeException {
    public DuplicateUserException(String message) {
        super(message);
    }
}

// InvalidCredentialsException.java
package com.crypto.dashboard.exception;

public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException(String message) {
        super(message);
    }
}

// DuplicateFavoriteException.java
package com.crypto.dashboard.exception;

public class DuplicateFavoriteException extends RuntimeException {
    public DuplicateFavoriteException(String message) {
        super(message);
    }
}
```

**步驟 2：建立全域例外處理器**

建立 `backend/src/main/java/com/crypto/dashboard/exception/GlobalExceptionHandler.java`：

```java
package com.crypto.dashboard.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // 處理驗證錯誤
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    // 處理資源未找到
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleResourceNotFoundException(
            ResourceNotFoundException ex) {
        logger.warn("Resource not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }

    // 處理重複用戶
    @ExceptionHandler(DuplicateUserException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateUserException(
            DuplicateUserException ex) {
        logger.warn("Duplicate user: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", ex.getMessage()));
    }

    // 處理認證錯誤
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleInvalidCredentialsException(
            InvalidCredentialsException ex) {
        logger.warn("Invalid credentials: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", ex.getMessage()));
    }

    // 處理重複收藏
    @ExceptionHandler(DuplicateFavoriteException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateFavoriteException(
            DuplicateFavoriteException ex) {
        logger.warn("Duplicate favorite: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", ex.getMessage()));
    }

    // 處理其他未捕獲的例外
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        logger.error("Unexpected error occurred", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "伺服器發生錯誤，請稍後再試"));
    }
}
```

#### Day 3-4：建立 Controller 層

**Controller 1: AuthController.java**

建立 `backend/src/main/java/com/crypto/dashboard/controller/AuthController.java`：

```java
package com.crypto.dashboard.controller;

import com.crypto.dashboard.dto.AuthResponse;
import com.crypto.dashboard.dto.LoginRequest;
import com.crypto.dashboard.dto.RegisterRequest;
import com.crypto.dashboard.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        authService.logout(token);
        return ResponseEntity.ok().build();
    }
}
```

**Controller 2: FavoriteController.java**

建立 `backend/src/main/java/com/crypto/dashboard/controller/FavoriteController.java`：

```java
package com.crypto.dashboard.controller;

import com.crypto.dashboard.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @GetMapping
    public ResponseEntity<List<String>> getFavorites(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        List<String> favorites = favoriteService.getFavorites(userId);
        return ResponseEntity.ok(favorites);
    }

    @PostMapping
    public ResponseEntity<Void> addFavorite(
            @RequestParam String coinId,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        favoriteService.addFavorite(userId, coinId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{coinId}")
    public ResponseEntity<Void> removeFavorite(
            @PathVariable String coinId,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        favoriteService.removeFavorite(userId, coinId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/all")
    public ResponseEntity<Void> clearFavorites(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        favoriteService.clearFavorites(userId);
        return ResponseEntity.ok().build();
    }
}
```

#### Day 5-7：Spring Security 配置

**步驟 1：建立 JWT 過濾器**

建立 `backend/src/main/java/com/crypto/dashboard/config/JwtAuthenticationFilter.java`：

```java
package com.crypto.dashboard.config;

import com.crypto.dashboard.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            if (jwtUtil.validateToken(token)) {
                Long userId = jwtUtil.getUserIdFromToken(token);
                String role = jwtUtil.getRoleFromToken(token);

                // 設定權限
                List<SimpleGrantedAuthority> authorities =
                    List.of(new SimpleGrantedAuthority("ROLE_" + role));

                // 建立認證物件
                UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userId, null, authorities);

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}
```

**步驟 2：建立 Security 配置**

建立 `backend/src/main/java/com/crypto/dashboard/config/SecurityConfig.java`：

```java
package com.crypto.dashboard.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {})
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**", "/coins/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

**步驟 3：建立 CORS 配置**

建立 `backend/src/main/java/com/crypto/dashboard/config/CorsConfig.java`：

```java
package com.crypto.dashboard.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

#### Day 8：測試後端 API

**啟動後端**

```bash
cd backend
mvn spring-boot:run
```

**使用 Postman 測試**

1. **註冊 API**
   - URL: `POST http://localhost:8080/api/auth/register`
   - Body (JSON):
     ```json
     {
       "username": "testuser",
       "email": "test@example.com",
       "password": "password123"
     }
     ```

2. **登入 API**
   - URL: `POST http://localhost:8080/api/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "test@example.com",
       "password": "password123"
     }
     ```
   - 複製回應中的 `token`

3. **測試收藏 API**
   - URL: `GET http://localhost:8080/api/favorites`
   - Headers: `Authorization: Bearer {你的token}`

#### 學習檢查點
- [ ] 理解 Spring Security 的過濾器鏈
- [ ] 理解 JWT 認證流程
- [ ] 理解 CORS 的作用
- [ ] 成功測試所有 API

**Gemini 提示**：
- 解釋為什麼需要 JWT 過濾器
- 解釋 `@RestControllerAdvice` 的作用
- 確認學習者可以成功測試 API

---

## 🎨 第三階段：前端基礎建設（第 6-8 週）

### Week 6：Vue Router 與專案結構

#### 目標
建立前端專案結構和路由系統

#### Day 1-2：清理初始專案與建立資料夾結構

**步驟 1：清理 Vite 預設檔案**

```bash
cd frontend/src

# 刪除不需要的檔案
rm -rf assets/*.svg
rm components/HelloWorld.vue
```

**步驟 2：建立完整的資料夾結構**

```bash
cd frontend/src
mkdir -p {components,views,stores,router,utils,assets/images,locales}
```

最終結構：
```
frontend/src/
├── assets/          # 靜態資源
│   └── images/
├── components/      # 共用元件
├── views/           # 頁面元件
├── stores/          # Pinia Stores
├── router/          # 路由配置
├── utils/           # 工具函數
├── locales/         # 國際化語言檔
├── App.vue
└── main.js
```

#### Day 3-4：配置 Vue Router

**步驟 1：建立路由配置**

建立 `frontend/src/router/index.js`：

```javascript
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      component: () => import('../components/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/dashboard'
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue')
        },
        {
          path: 'market',
          name: 'market',
          component: () => import('../views/MarketListView.vue')
        },
        {
          path: 'coin/:id',
          name: 'coin-detail',
          component: () => import('../views/CoinDetailView.vue')
        },
        {
          path: 'watchlist',
          name: 'watchlist',
          component: () => import('../views/WatchlistView.vue')
        },
        {
          path: 'compare',
          name: 'compare',
          component: () => import('../views/CompareView.vue')
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('../views/ProfileView.vue')
        },
        {
          path: 'admin',
          name: 'admin',
          component: () => import('../views/AdminView.vue'),
          meta: { requiresAdmin: true }
        }
      ]
    }
  ]
})

// 路由守衛
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('authToken')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  // 處理根路徑
  if (to.path === '/' && isAuthenticated) {
    if (user.role === 'admin') {
      next('/admin')
      return
    } else {
      next('/dashboard')
      return
    }
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next(user.role === 'admin' ? '/admin' : '/dashboard')
  } else if (to.meta.requiresAdmin && user.role !== 'admin') {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
```

**步驟 2：修改 main.js**

編輯 `frontend/src/main.js`：

```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
```

#### Day 5-7：建立基礎元件

**元件 1：MainLayout.vue**

建立 `frontend/src/components/MainLayout.vue`：

```vue
<template>
  <div class="layout">
    <Sidebar />
    <div class="main-content">
      <Navbar />
      <div class="page-container">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: #0f1419;
}

.main-content {
  flex: 1;
  margin-left: 250px;
  transition: margin-left 0.3s;
}

.page-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}
</style>
```

**元件 2：Navbar.vue**

建立 `frontend/src/components/Navbar.vue`：

```vue
<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <h1>CoinVue 幣景</h1>
    </div>
    <div class="navbar-actions">
      <button @click="handleLogout" class="logout-btn">
        登出
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  background: #1a1f2e;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #2a3142;
}

.navbar-brand h1 {
  color: #fff;
  font-size: 20px;
  margin: 0;
}

.logout-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: #dc2626;
}
</style>
```

**元件 3：Sidebar.vue**

建立 `frontend/src/components/Sidebar.vue`：

```vue
<template>
  <aside class="sidebar">
    <div class="sidebar-menu">
      <router-link
        v-for="item in menuItems"
        :key="item.name"
        :to="item.path"
        class="menu-item"
        active-class="active"
      >
        <span>{{ item.label }}</span>
      </router-link>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'

const user = JSON.parse(localStorage.getItem('user') || '{}')

const menuItems = computed(() => {
  const items = []

  if (user.role === 'admin') {
    items.push({ name: 'admin', path: '/admin', label: '管理後台' })
  } else {
    items.push(
      { name: 'dashboard', path: '/dashboard', label: '儀表板' },
      { name: 'market', path: '/market', label: '市場總覽' },
      { name: 'watchlist', path: '/watchlist', label: '收藏清單' },
      { name: 'compare', path: '/compare', label: '幣種比較' }
    )
  }

  items.push({ name: 'profile', path: '/profile', label: '個人資料' })

  return items
})
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 250px;
  height: 100vh;
  background: #1a1f2e;
  border-right: 1px solid #2a3142;
  padding: 20px 0;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0 10px;
}

.menu-item {
  padding: 12px 20px;
  color: #94a3b8;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;
}

.menu-item:hover {
  background: #2a3142;
  color: #fff;
}

.menu-item.active {
  background: #3b82f6;
  color: #fff;
}
</style>
```

#### 學習檢查點
- [ ] 理解 Vue Router 的懶加載（動態導入）
- [ ] 理解路由守衛的作用
- [ ] 理解巢狀路由的配置
- [ ] 成功建立基礎佈局元件

**Gemini 提示**：
- 解釋 `meta` 欄位的作用
- 解釋路由守衛的執行順序
- 解釋為什麼使用 `localStorage` 儲存認證資訊

---

### Week 7-8：Pinia Store 與 API 整合

#### 目標
建立狀態管理和 API 請求工具

#### Day 1-3：建立 API 工具

**步驟 1：建立環境變數**

建立 `frontend/.env`：

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_COINGECKO_API_KEY=CG-vczvnvBTsqG7Z8EVB7KRb3ii
```

**步驟 2：建立統一 API 工具**

建立 `frontend/src/utils/api.js`：

```javascript
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// 建立 axios 實例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 請求攔截器：自動添加 Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 回應攔截器：處理 401 錯誤
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 認證 API
export const authApi = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout')
}

// 收藏 API
export const favoriteApi = {
  getFavorites: () => apiClient.get('/favorites'),
  addFavorite: (coinId) => apiClient.post(`/favorites?coinId=${coinId}`),
  removeFavorite: (coinId) => apiClient.delete(`/favorites/${coinId}`),
  clearFavorites: () => apiClient.delete('/favorites/all')
}

// 幣種 API（透過後端 proxy）
export const coinApi = {
  getList: (page = 1, perPage = 50) =>
    apiClient.get(`/coins?page=${page}&perPage=${perPage}`),
  getDetail: (id) => apiClient.get(`/coins/${id}`)
}

export default apiClient
```

#### Day 4-7：建立 Pinia Stores

**Store 1：useCoinsStore**

建立 `frontend/src/stores/useCoinsStore.js`：

```javascript
import { defineStore } from 'pinia'
import { coinApi } from '../utils/api'

const CACHE_TTL = 5 * 60 * 1000 // 5 分鐘

export const useCoinsStore = defineStore('coins', {
  state: () => ({
    cache: {},
    fetchedAt: {},
    isFetching: false,
    error: null
  }),

  actions: {
    async fetchCoins({ perPage = 50, page = 1, force = false } = {}) {
      const key = `${perPage}-${page}`
      const now = Date.now()
      const cached = this.cache[key]

      // 檢查快取
      if (!force && cached && now - (this.fetchedAt[key] || 0) < CACHE_TTL) {
        return cached
      }

      this.isFetching = true
      this.error = null

      try {
        const response = await coinApi.getList(page, perPage)
        const coins = response.data
        this.cache[key] = coins
        this.fetchedAt[key] = now
        return coins
      } catch (error) {
        console.error('Fetch coins failed:', error)
        this.error = '無法取得幣種資料'
        return []
      } finally {
        this.isFetching = false
      }
    }
  }
})
```

**Store 2：useFavoritesStore**

建立 `frontend/src/stores/useFavoritesStore.js`：

```javascript
import { defineStore } from 'pinia'
import { favoriteApi } from '../utils/api'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: [],
    isLoading: false,
    error: null
  }),

  getters: {
    isFavorite: (state) => (coinId) => {
      return state.favorites.includes(coinId)
    }
  },

  actions: {
    async loadFavorites() {
      if (this.isLoading) return

      this.isLoading = true
      this.error = null

      try {
        const response = await favoriteApi.getFavorites()
        this.favorites = response.data
      } catch (error) {
        console.error('Load favorites failed:', error)
        this.error = '無法載入收藏清單'
      } finally {
        this.isLoading = false
      }
    },

    async addFavorite(coinId) {
      try {
        await favoriteApi.addFavorite(coinId)
        this.favorites.push(coinId)
      } catch (error) {
        console.error('Add favorite failed:', error)
        throw error
      }
    },

    async removeFavorite(coinId) {
      try {
        await favoriteApi.removeFavorite(coinId)
        this.favorites = this.favorites.filter(id => id !== coinId)
      } catch (error) {
        console.error('Remove favorite failed:', error)
        throw error
      }
    },

    async clearFavorites() {
      try {
        await favoriteApi.clearFavorites()
        this.favorites = []
      } catch (error) {
        console.error('Clear favorites failed:', error)
        throw error
      }
    }
  }
})
```

#### 學習檢查點
- [ ] 理解 Pinia Store 的結構（state、getters、actions）
- [ ] 理解 axios 攔截器的作用
- [ ] 理解快取機制的實作
- [ ] 成功建立 API 工具和 Stores

**Gemini 提示**：
- 解釋為什麼需要快取機制
- 解釋 axios 攔截器的應用場景
- 解釋 Pinia 與 Vuex 的差異

---

## 🔗 第四階段：前後端整合（第 9-10 週）

### Week 9：核心頁面實作

#### 目標
實作登入、註冊、Dashboard、Market 頁面

#### Day 1-2：登入與註冊頁面

**LoginView.vue**

建立 `frontend/src/views/LoginView.vue`：

```vue
<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>登入 CoinVue</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="請輸入 Email"
            required
          />
        </div>
        <div class="form-group">
          <label>密碼</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="請輸入密碼"
            required
          />
        </div>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? '登入中...' : '登入' }}
        </button>
      </form>
      <p class="auth-link">
        還沒有帳號？<router-link to="/register">立即註冊</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '../utils/api'

const router = useRouter()

const form = ref({
  email: '',
  password: ''
})

const isLoading = ref(false)
const error = ref(null)

const handleLogin = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await authApi.login(form.value)
    const { token, user } = response.data

    localStorage.setItem('authToken', token)
    localStorage.setItem('user', JSON.stringify(user))

    // 根據角色跳轉
    router.push(user.role === 'admin' ? '/admin' : '/dashboard')
  } catch (err) {
    error.value = err.response?.data?.error || '登入失敗，請稍後再試'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.auth-card h1 {
  margin-bottom: 30px;
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: #ef4444;
  background: #fee2e2;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 15px;
  font-size: 14px;
}

.auth-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.auth-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.auth-link a:hover {
  text-decoration: underline;
}
</style>
```

**RegisterView.vue** - 結構類似，將登入改為註冊即可

#### Day 3-7：Dashboard 與 Market 頁面

**DashboardView.vue** - 簡化版範例：

```vue
<template>
  <div class="dashboard">
    <h1>歡迎回來，{{ user.username }}</h1>

    <div class="stats-grid">
      <div class="stat-card">
        <h3>總市值</h3>
        <p class="stat-value">$2.5T</p>
      </div>
      <div class="stat-card">
        <h3>24h 交易量</h3>
        <p class="stat-value">$150B</p>
      </div>
      <div class="stat-card">
        <h3>BTC 主導率</h3>
        <p class="stat-value">45.2%</p>
      </div>
    </div>

    <h2>熱門幣種</h2>
    <div v-if="isLoading">載入中...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="coin-list">
      <CoinCard v-for="coin in coins" :key="coin.id" :coin="coin" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCoinsStore } from '../stores/useCoinsStore'
import CoinCard from '../components/CoinCard.vue'

const coinsStore = useCoinsStore()
const user = JSON.parse(localStorage.getItem('user') || '{}')

const coins = ref([])
const isLoading = ref(false)
const error = ref(null)

onMounted(async () => {
  isLoading.value = true
  try {
    coins.value = await coinsStore.fetchCoins({ perPage: 10 })
  } catch (err) {
    error.value = '無法載入幣種資料'
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.stat-card {
  background: #1a1f2e;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #2a3142;
}

.stat-card h3 {
  color: #94a3b8;
  font-size: 14px;
  margin-bottom: 10px;
}

.stat-value {
  color: #fff;
  font-size: 24px;
  font-weight: bold;
}

.coin-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
</style>
```

#### 學習檢查點
- [ ] 成功實作登入註冊頁面
- [ ] 理解表單驗證與錯誤處理
- [ ] 成功串接後端 API
- [ ] 理解認證流程（Token 儲存與使用）

**Gemini 提示**：
- 確認學習者可以成功登入並跳轉
- 解釋 localStorage 的安全性考量
- 解釋前後端資料流程

---

### Week 10：收藏與詳情頁面

（此處應包含 WatchlistView、CoinDetailView 的實作）

---

## ⚡ 第五階段：進階功能實作（第 11-13 週）

（此處應包含 Admin Panel、公告系統、進階篩選、國際化等功能的實作）

---

## 📦 第六階段：優化與部署（第 14-15 週）

（此處應包含效能優化、安全性強化、Docker 部署、CI/CD 等內容）

---

## 📝 學習建議

### 給學習者的建議
1. **不要跳過步驟**：每個階段都很重要，打好基礎才能順利進行
2. **動手實作**：光看不做是學不會的，一定要親自寫代碼
3. **遇到問題先思考**：嘗試自己解決，實在不行再詢問 Gemini
4. **定期回顧**：每週回顧已完成的部分，確保知識連貫
5. **做筆記**：記錄學習過程中的重點和心得

### 給 Gemini 的建議
1. **保持耐心**：學習者可能需要時間消化，不要急於推進
2. **提供範例**：給出完整、可運行的代碼範例
3. **解釋原理**：不只是「怎麼做」，更要解釋「為什麼」
4. **鼓勵學習者**：適時給予正面回饋，提升學習動力
5. **靈活調整**：根據學習者的程度調整教學節奏

---

## 🔚 結語

這是一個完整的全端專案，涵蓋了現代 Web 開發的各個層面。透過這個專案，你將學會：

**前端技能**
- Vue 3 Composition API
- Pinia 狀態管理
- Vue Router 路由管理
- 元件化開發
- API 整合與錯誤處理

**後端技能**
- Spring Boot 框架
- Spring Security 與 JWT 認證
- JPA/Hibernate ORM
- RESTful API 設計
- 資料庫設計與優化

**全端技能**
- 前後端分離架構
- API 設計與文檔
- 安全性最佳實踐
- 部署與維運

祝你學習順利！加油！💪

---

**文檔版本**：1.0
**建立日期**：2025-12-12
**適用專案版本**：CoinVue v1.2.0
