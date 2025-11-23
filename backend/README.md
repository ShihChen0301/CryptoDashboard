# CryptoDashboard Backend

Spring Boot 3 + MySQL 8 後端 API

## 技術棧

- **Java**: 17+
- **Spring Boot**: 3.2.0
- **Spring Security**: JWT 認證
- **Spring Data JPA**: Hibernate ORM
- **MySQL**: 8.0+
- **Maven**: 3.8+

## 快速開始

### 1. 環境需求

確保已安裝：
- JDK 17 或更高版本
- Maven 3.8+
- MySQL 8.0+

### 2. 資料庫設定

```bash
# 建立資料庫
mysql -u root -p < ../database/schema.sql
```

### 3. 配置資料庫連線

編輯 `src/main/resources/application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/crypto_dashboard
    username: root
    password: your_password_here  # 修改為你的 MySQL 密碼
```

### 4. 啟動後端

```bash
# 方法一：使用 Maven
mvn spring-boot:run

# 方法二：先編譯再執行
mvn clean package
java -jar target/dashboard-backend-1.0.0.jar
```

啟動成功後，訪問：
- API 位址：http://localhost:8080/api
- 測試端點：http://localhost:8080/api/test

## 專案結構

```
backend/
├── src/main/java/com/crypto/dashboard/
│   ├── CryptoDashboardApplication.java    # 主程式
│   ├── config/                            # 配置類
│   │   └── CorsConfig.java
│   ├── controller/                        # API 控制器
│   ├── service/                           # 業務邏輯層
│   ├── repository/                        # 資料存取層
│   ├── entity/                            # 實體類（資料表對應）
│   │   ├── User.java
│   │   ├── AuthToken.java
│   │   ├── CoinFavorite.java
│   │   └── Announcement.java
│   ├── dto/                               # 資料傳輸物件
│   │   ├── request/
│   │   └── response/
│   │       └── ApiResponse.java           # 統一回應格式
│   ├── exception/                         # 例外處理
│   │   ├── GlobalExceptionHandler.java
│   │   ├── InvalidCredentialsException.java
│   │   ├── UnauthorizedException.java
│   │   ├── ValidationException.java
│   │   └── ResourceNotFoundException.java
│   ├── security/                          # 安全相關（JWT）
│   └── util/                              # 工具類
└── src/main/resources/
    ├── application.yml                    # 主配置
    ├── application-dev.yml                # 開發環境
    └── application-prod.yml               # 生產環境
```

## API 端點（規劃）

### 認證相關
- `POST /api/auth/register` - 用戶註冊
- `POST /api/auth/login` - 用戶登入
- `POST /api/auth/logout` - 用戶登出

### 用戶相關
- `GET /api/users/me` - 取得當前用戶資訊
- `PUT /api/users/me` - 更新用戶資訊

### 收藏相關
- `GET /api/favorites` - 取得收藏列表
- `POST /api/favorites` - 新增收藏
- `DELETE /api/favorites/:coinId` - 移除收藏

### 公告相關
- `GET /api/announcements` - 取得啟用的公告
- `POST /api/announcements` - 建立公告（管理員）
- `PUT /api/announcements/:id` - 更新公告（管理員）
- `DELETE /api/announcements/:id` - 刪除公告（管理員）

### 管理員相關
- `GET /api/admin/users` - 取得所有用戶
- `GET /api/admin/stats` - 取得統計資訊

## 開發指南

### 修改資料庫密碼

編輯 `src/main/resources/application.yml` 第 8 行。

### 使用不同環境配置

```bash
# 開發環境
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# 生產環境
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

### 建立新的 API 端點

1. 在 `entity/` 建立實體類
2. 在 `repository/` 建立 Repository 介面
3. 在 `service/` 建立 Service 類
4. 在 `controller/` 建立 Controller 類

## 常見問題

### Q: 啟動時出現資料庫連線錯誤？
A: 檢查 MySQL 是否啟動，以及 `application.yml` 中的密碼是否正確。

### Q: 如何查看 SQL 查詢？
A: 已在 `application.yml` 設定 `show-sql: true`，查詢會顯示在 console。

### Q: 如何新增測試用戶？
A: 參考 `../database/schema.sql` 底部的 INSERT 語句（需先用 BCrypt 加密密碼）。

## 下一步

查看完整開發指南：
- [後端規劃](../docs/後端規劃.md)
- [專案結構規劃](../docs/專案結構規劃.md)

## 測試

```bash
# 執行所有測試
mvn test

# 執行特定測試
mvn test -Dtest=UserServiceTest
```

---

**版本**: 1.0.0
**最後更新**: 2024-11-23
