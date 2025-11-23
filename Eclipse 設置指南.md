# Eclipse 設置指南 - CryptoDashboard Backend

完整的 Eclipse IDE 設置步驟

---

## 📋 前置準備

### 1. 確認 Eclipse 版本

建議使用：
- **Eclipse IDE for Enterprise Java and Web Developers** (最新版)
- 或 **Eclipse IDE for Java Developers** + Spring Tools 插件

如果還沒安裝，請下載：
- 官網：https://www.eclipse.org/downloads/
- 選擇 "Eclipse IDE for Enterprise Java and Web Developers"

### 2. 確認 JDK 版本

```bash
java -version
```

應顯示 **JDK 17 或更高版本**。如果不是，請先安裝 JDK 17。

### 3. 確認 Maven 是否可用

Eclipse 內建 Maven，但也可以使用外部 Maven：

```bash
mvn -version
```

---

## 🚀 在 Eclipse 中導入專案

### 步驟 1: 導入 Maven 專案

1. **開啟 Eclipse**

2. **導入專案**
   - `File` → `Import...`
   - 展開 `Maven` 資料夾
   - 選擇 `Existing Maven Projects`
   - 點擊 `Next`

3. **選擇專案目錄**
   - Root Directory: 瀏覽到 `C:\史晨\商研院上課內容\CryptoDashboard\backend`
   - 確認勾選 `/pom.xml`
   - 點擊 `Finish`

4. **等待 Maven 下載依賴**
   - Eclipse 會自動開始下載依賴套件
   - 右下角會顯示進度
   - 第一次可能需要 5-10 分鐘（取決於網速）

### 步驟 2: 設定 JDK 版本

1. **專案右鍵 → Properties**

2. **Java Build Path**
   - 選擇 `Libraries` 頁籤
   - 確認 JRE System Library 是 **JavaSE-17** 或更高

3. **如果版本不對**
   - 移除舊的 JRE System Library
   - `Add Library...` → `JRE System Library` → `JavaSE-17`

### 步驟 3: 設定 Maven 配置

1. **專案右鍵 → Properties**

2. **Maven**
   - 確認 `Active Maven Profiles` 為空或 `dev`

3. **Java Compiler**
   - Compiler compliance level: **17**

---

## 🔧 安裝 Spring Tools (選用但推薦)

Spring Tools 提供更好的 Spring Boot 開發體驗。

### 方法一: Eclipse Marketplace (推薦)

1. `Help` → `Eclipse Marketplace...`
2. 搜尋 `Spring Tools`
3. 安裝 **Spring Tools 4**
4. 重啟 Eclipse

### 方法二: Update Site

1. `Help` → `Install New Software...`
2. Work with: 輸入 `https://download.springsource.com/release/TOOLS/sts4/update/latest/`
3. 選擇 `Spring Tools 4`
4. 安裝並重啟

---

## ▶️ 啟動 Spring Boot 專案

### 方法一: Run as Spring Boot App (推薦)

1. 在 Package Explorer 中找到 `CryptoDashboardApplication.java`
2. **右鍵** → `Run As` → `Spring Boot App`

### 方法二: Run as Java Application

1. 找到 `CryptoDashboardApplication.java`
2. **右鍵** → `Run As` → `Java Application`

### 方法三: Maven 指令

1. **專案右鍵** → `Run As` → `Maven build...`
2. Goals: 輸入 `spring-boot:run`
3. 點擊 `Run`

---

## 🛠️ 設定資料庫連線

### 修改 application.yml

1. 在 Package Explorer 展開：
   ```
   backend
   └── src/main/resources
       └── application.yml
   ```

2. 雙擊開啟 `application.yml`

3. 修改第 8 行的密碼：
   ```yaml
   spring:
     datasource:
       password: your_mysql_password  # 改成你的 MySQL 密碼
   ```

4. 儲存檔案 (Ctrl + S)

---

## 📁 Eclipse 專案結構檢視

導入成功後，你應該會看到：

```
dashboard-backend
├── src/main/java
│   └── com.crypto.dashboard
│       ├── CryptoDashboardApplication.java  ← 主程式
│       ├── config
│       │   └── CorsConfig.java
│       ├── entity
│       │   ├── User.java
│       │   ├── AuthToken.java
│       │   ├── CoinFavorite.java
│       │   └── Announcement.java
│       ├── dto
│       │   └── response
│       │       └── ApiResponse.java
│       └── exception
│           ├── GlobalExceptionHandler.java
│           ├── CryptoDashboardException.java
│           └── ...
├── src/main/resources
│   ├── application.yml
│   ├── application-dev.yml
│   └── application-prod.yml
├── src/test/java
├── Maven Dependencies
└── pom.xml
```

---

## ✅ 驗證設置是否成功

### 1. 檢查 Maven Dependencies

1. 展開 `Maven Dependencies`
2. 應該看到許多 JAR 檔案：
   - `spring-boot-starter-web-3.2.0.jar`
   - `spring-boot-starter-data-jpa-3.2.0.jar`
   - `mysql-connector-j-8.x.x.jar`
   - `jjwt-api-0.11.5.jar`
   - 等等...

### 2. 檢查錯誤標記

- Package Explorer 中的專案不應該有紅色 ❌ 標記
- 如果有錯誤，通常是因為：
  - JDK 版本不對
  - Maven 依賴下載失敗

### 3. 測試編譯

1. **專案右鍵** → `Run As` → `Maven build...`
2. Goals: 輸入 `clean compile`
3. 點擊 `Run`
4. Console 應顯示 `BUILD SUCCESS`

---

## 🎯 第一次啟動

### 步驟 1: 建立資料庫

在命令列執行：

```bash
cd "C:\史晨\商研院上課內容\CryptoDashboard"
mysql -u root -p < database/schema.sql
```

輸入 MySQL 密碼，資料庫 `crypto_dashboard` 將被建立。

### 步驟 2: 啟動專案

1. 找到 `CryptoDashboardApplication.java`
2. **右鍵** → `Run As` → `Spring Boot App`

### 步驟 3: 檢查啟動訊息

Console 應該顯示：

```
========================================
CryptoDashboard Backend 啟動成功！
API 位址: http://localhost:8080/api
========================================

Started CryptoDashboardApplication in X.XXX seconds
```

如果看到這個訊息，恭喜！🎉 後端已成功啟動。

---

## ⚠️ 常見問題排解

### 問題 1: 專案有紅色錯誤標記

**原因**: JDK 版本不符

**解決**:
1. 專案右鍵 → `Properties`
2. `Java Build Path` → `Libraries`
3. 移除舊的 JRE，新增 JavaSE-17

### 問題 2: "The import org.springframework cannot be resolved"

**原因**: Maven 依賴下載失敗

**解決**:
1. 專案右鍵 → `Maven` → `Update Project...`
2. 勾選 `Force Update of Snapshots/Releases`
3. 點擊 `OK`

### 問題 3: Maven Dependencies 是空的

**原因**: Maven 沒有正確下載依賴

**解決**:
```bash
# 在命令列進入 backend 資料夾
cd "C:\史晨\商研院上課內容\CryptoDashboard\backend"

# 清理並重新安裝
mvn clean install
```

然後在 Eclipse 中：
1. 專案右鍵 → `Maven` → `Update Project...`
2. 勾選 `Force Update of Snapshots/Releases`
3. 點擊 `OK`

### 問題 4: 啟動時出現 "Access denied for user 'root'"

**原因**: MySQL 密碼錯誤

**解決**:
1. 檢查 `application.yml` 中的密碼是否正確
2. 確認 MySQL 使用者名稱是 `root`

### 問題 5: 啟動時出現 "Table 'crypto_dashboard.users' doesn't exist"

**原因**: 資料庫還沒建立

**解決**:
```bash
mysql -u root -p < database/schema.sql
```

### 問題 6: 埠號 8080 已被佔用

**錯誤訊息**: "Port 8080 is already in use"

**解決**:
編輯 `application.yml`，修改埠號：
```yaml
server:
  port: 8081  # 改成其他埠號
```

---

## 🔍 Eclipse 實用快捷鍵

| 快捷鍵 | 功能 |
|--------|------|
| `Ctrl + Shift + O` | 自動 import 缺少的類別 |
| `Ctrl + Shift + F` | 格式化程式碼 |
| `Ctrl + Space` | 自動完成 |
| `Ctrl + 1` | 快速修復建議 |
| `F3` | 跳轉到定義 |
| `Ctrl + Shift + T` | 開啟類別 |
| `Ctrl + Shift + R` | 開啟檔案 |
| `Ctrl + H` | 搜尋 |

---

## 📦 Eclipse 專案配置檔案

專案導入後會產生以下檔案（已加入 .gitignore）：

```
backend/
├── .classpath          # Eclipse 類別路徑
├── .project            # Eclipse 專案配置
└── .settings/          # Eclipse 設定
```

這些檔案不需要 commit 到 Git。

---

## 🎨 Eclipse 推薦設定

### 1. 字型與配色

`Window` → `Preferences` → `General` → `Appearance` → `Colors and Fonts`

### 2. 自動儲存

`Window` → `Preferences` → `General` → `Editors` → `Text Editors`
- 勾選 `Show line numbers`

### 3. Maven 設定

`Window` → `Preferences` → `Maven`
- 勾選 `Download Artifact Sources`
- 勾選 `Download Artifact JavaDoc`

### 4. 程式碼格式化

`Window` → `Preferences` → `Java` → `Code Style` → `Formatter`
- 可以設定縮排、括號位置等

---

## 📝 下一步：開始開發

### 1. 建立第一個 Repository

在 `src/main/java/com/crypto/dashboard/repository/` 建立：

**UserRepository.java**
```java
package com.crypto.dashboard.repository;

import com.crypto.dashboard.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}
```

### 2. 建立第一個 Service

參考 `docs/後端規劃.md` 第五章的範例程式碼。

### 3. 建立第一個 Controller

參考 `docs/後端規劃.md` 第三章的 API 設計。

---

## 🚀 Eclipse 中的除錯

### 設定中斷點 (Breakpoint)

1. 在程式碼行號左側雙擊，設定中斷點（藍色圓點）
2. **右鍵** → `Debug As` → `Spring Boot App`
3. 程式執行到中斷點會暫停
4. 可以查看變數值、單步執行等

### 除錯快捷鍵

| 快捷鍵 | 功能 |
|--------|------|
| `F5` | 單步執行（進入方法） |
| `F6` | 單步執行（跳過方法） |
| `F7` | 跳出方法 |
| `F8` | 繼續執行 |

---

## 📚 參考資源

- Eclipse 官方文檔：https://help.eclipse.org/
- Spring Tools 文檔：https://spring.io/tools
- Maven 教學：https://maven.apache.org/guides/

---

## ✅ 檢查清單

在開始開發前，確認：

- [ ] Eclipse 已安裝（建議 2023-12 或更新版本）
- [ ] JDK 17 已安裝並設定
- [ ] 專案已成功導入 Eclipse
- [ ] Maven Dependencies 已下載完成
- [ ] 沒有紅色錯誤標記
- [ ] `application.yml` 資料庫密碼已修改
- [ ] MySQL 資料庫 `crypto_dashboard` 已建立
- [ ] 專案可以成功啟動
- [ ] Console 顯示 "CryptoDashboard Backend 啟動成功！"

---

**全部完成後，你就可以開始開發 API 了！** 🎉

有任何問題隨時問我！

---

**建立時間**: 2024-11-23
**適用於**: Eclipse IDE for Enterprise Java and Web Developers
