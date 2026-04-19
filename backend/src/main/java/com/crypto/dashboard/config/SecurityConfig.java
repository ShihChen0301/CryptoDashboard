package com.crypto.dashboard.config;

import com.crypto.dashboard.filter.JwtAuthenticationFilter;
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

/**
 * Spring Security 安全配置類
 * 作用：設定整個應用的安全規則（誰可以訪問哪些 API、如何驗證身份）
 */
@Configuration  // 告訴 Spring 這是一個配置類
@EnableWebSecurity  // 啟用 Spring Security 功能
@RequiredArgsConstructor  // Lombok 自動生成建構子，注入 final 欄位
public class SecurityConfig {

    // 注入自定義的 JWT 過濾器（每個請求都會先經過這個過濾器檢查 Token）
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * 安全過濾鏈配置（核心方法）
     * 作用：定義哪些路徑需要登入、哪些路徑公開、如何驗證身份
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. 關閉 CSRF 保護（因為我們用 JWT，不需要 CSRF Token）
            .csrf(csrf -> csrf.disable())

            // 2. 啟用 CORS 跨域請求（允許前端 localhost:5173 訪問後端 localhost:8080）
            .cors(cors -> {})

            // 3. Session 管理設定為無狀態（不使用傳統的 Session Cookie，改用 JWT）
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // 4. 設定路徑的訪問權限規則
            .authorizeHttpRequests(auth -> auth
                // ========== 公開路徑（不需要登入就能訪問）==========
                .requestMatchers("/api/auth/**").permitAll()  // 註冊、登入 API
                .requestMatchers("/api/coins/**").permitAll()  // 幣種查詢 API（CoinGecko Proxy）
                .requestMatchers("/api/announcements").permitAll()  // 查看系統公告 API

                // ========== Swagger API 文檔路徑（開發時方便測試）==========
                .requestMatchers("/swagger-ui/**").permitAll()
                .requestMatchers("/v3/api-docs/**").permitAll()
                .requestMatchers("/swagger-ui.html").permitAll()

                // ========== 管理員專用路徑（需要 ADMIN 角色才能訪問）==========
                .requestMatchers("/api/admin/**").hasRole("ADMIN")  // 數據總覽、用戶管理、公告管理

                // ========== 其他所有路徑都需要登入（需要有效的 JWT Token）==========
                .anyRequest().authenticated()  // 例如：收藏 API、個人資料 API
            )

            // 5. 將 JWT 過濾器加入 Spring Security 過濾鏈（在用戶名密碼驗證之前執行）
            // 每個請求的流程：JwtAuthenticationFilter → UsernamePasswordAuthenticationFilter → Controller
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();  // 建立並返回安全配置
    }

    /**
     * 密碼加密器（用於註冊和登入時的密碼加密/驗證）
     * BCrypt 是目前最安全的密碼加密演算法之一（自動加鹽、防彩虹表攻擊）
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
