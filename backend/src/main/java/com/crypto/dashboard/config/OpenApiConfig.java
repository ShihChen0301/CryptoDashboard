package com.crypto.dashboard.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger / OpenAPI 配置
 *
 * 提供 API 文檔介面，方便開發與測試
 * 訪問路徑：http://localhost:8080/api/swagger-ui/index.html
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        // 定義 JWT 安全方案
        final String securitySchemeName = "Bearer Authentication";

        return new OpenAPI()
                // API 基本資訊
                .info(new Info()
                        .title("CoinVue（幣景）API 文檔")
                        .version("v1.2.0")
                        .description("加密貨幣市場監控平台 RESTful API\n\n" +
                                "## 功能模組\n" +
                                "- **認證模組**：用戶註冊、登入、登出\n" +
                                "- **收藏模組**：新增、查詢、刪除收藏幣種\n" +
                                "- **幣種模組**：查詢幣種列表、幣種詳情、歷史價格\n" +
                                "- **管理模組**：統計數據、用戶管理（需 Admin 權限）\n" +
                                "- **公告模組**：系統公告管理（需 Admin 權限）\n\n" +
                                "## 認證方式\n" +
                                "大部分 API 需要 JWT Token 認證，請在右上角點擊 🔒 Authorize 輸入 Token。")
                        .contact(new Contact()
                                .name("CoinVue 開發團隊")
                                .email("support@coinvue.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))

                // 添加 JWT 認證配置
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("請輸入 JWT Token（登入後從回應中取得）")));
    }
}
