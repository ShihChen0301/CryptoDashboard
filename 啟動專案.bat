@echo off
chcp 65001 >nul
echo ========================================
echo   啟動 CoinVue（幣景）專案
echo ========================================
echo.
echo 正在啟動前端服務...
start "CoinVue 前端 (npm run dev)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo 正在啟動後端服務...
start "CoinVue 後端 (mvn spring-boot:run)" cmd /k "cd /d "%~dp0backend" && mvn spring-boot:run"

echo.
echo ========================================
echo   專案啟動完成！
echo ========================================
echo   前端: http://localhost:5173
echo   後端: http://localhost:8080/api
echo ========================================
echo.
pause
