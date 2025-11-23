@echo off
chcp 65001 > nul
echo ========================================
echo CryptoDashboard 專案結構重構
echo ========================================
echo.

REM 切換到專案根目錄
cd /d "%~dp0"

echo [1/6] 檢查目前資料夾狀態...
if exist "前端" (
    echo ✓ 找到「前端」資料夾
) else (
    echo ✗ 找不到「前端」資料夾，腳本終止
    pause
    exit /b 1
)

echo.
echo [2/6] 重新命名「前端」→「frontend」...
if exist "frontend" (
    echo ! 警告：frontend 資料夾已存在，跳過重新命名
) else (
    ren "前端" frontend
    if %errorlevel% equ 0 (
        echo ✓ 重新命名成功
    ) else (
        echo ✗ 重新命名失敗
        pause
        exit /b 1
    )
)

echo.
echo [3/6] 建立必要的資料夾...
if not exist "docs" mkdir docs
if not exist "backend" mkdir backend
if not exist "scripts" mkdir scripts
echo ✓ 資料夾建立完成

echo.
echo [4/6] 移動文檔到 docs 資料夾...
if exist "後端規劃.md" (
    move "後端規劃.md" "docs\後端規劃.md" > nul
    echo ✓ 移動 後端規劃.md
)
if exist "專案結構規劃.md" (
    move "專案結構規劃.md" "docs\專案結構規劃.md" > nul
    echo ✓ 移動 專案結構規劃.md
)

echo.
echo [5/6] 建立文檔索引 (docs\README.md)...
(
echo # 專案文檔
echo.
echo ## 目錄
echo.
echo - [後端規劃](./後端規劃.md^) - Java Spring Boot 架構設計
echo - [專案結構規劃](./專案結構規劃.md^) - 資料夾組織方案
echo.
echo ## 快速連結
echo.
echo - 前端專案：`../frontend/CryptoDashboard/`
echo - 後端專案：`../backend/`
echo - 資料庫腳本：`../database/`
echo.
echo ## 開發指南
echo.
echo ### 前端開發
echo.
echo ```bash
echo cd frontend/CryptoDashboard
echo npm install
echo npm run dev
echo ```
echo.
echo ### 後端開發
echo.
echo ```bash
echo cd backend
echo mvn spring-boot:run
echo ```
) > "docs\README.md"
echo ✓ 文檔索引建立完成

echo.
echo [6/6] 更新 .gitignore...
(
echo # 環境變數
echo *.env
echo *.env.local
echo.
echo # IDE
echo .idea/
echo .vscode/
echo *.iml
echo.
echo # 前端
echo frontend/CryptoDashboard/node_modules/
echo frontend/CryptoDashboard/dist/
echo frontend/CryptoDashboard/.env
echo.
echo # 後端
echo backend/target/
echo backend/.mvn/
echo backend/mvnw
echo backend/mvnw.cmd
echo backend/HELP.md
echo backend/.env
echo.
echo # 日誌
echo *.log
echo.
echo # 系統檔案
echo .DS_Store
echo Thumbs.db
) > ".gitignore"
echo ✓ .gitignore 更新完成

echo.
echo ========================================
echo ✅ 專案結構重構完成！
echo ========================================
echo.
echo 新的結構：
echo   CryptoDashboard/
echo   ├── frontend/          (原「前端」資料夾)
echo   ├── backend/           (新建，待建立 Spring Boot 專案)
echo   ├── database/          (已存在)
echo   ├── docs/              (文檔集中管理)
echo   └── scripts/           (自動化腳本)
echo.
echo 下一步：
echo   1. 檢查 frontend/ 資料夾是否正常
echo   2. 在 backend/ 建立 Spring Boot 專案
echo   3. 查看 docs/後端規劃.md 開始開發
echo.
pause
