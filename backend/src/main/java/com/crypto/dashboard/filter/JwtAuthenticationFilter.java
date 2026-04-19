package com.crypto.dashboard.filter;

import com.crypto.dashboard.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

/**
 * JWT 認證過濾器（Spring Security 過濾鏈的第一道關卡）
 * 作用：攔截所有 HTTP 請求，從 Authorization Header 中提取並驗證 JWT Token
 * 流程：每個請求都會先經過這個過濾器 → 驗證 Token → 設定用戶身份 → 繼續執行後續過濾器
 */
@Component  // 告訴 Spring 這是一個 Bean，會被自動掃描並注入到 SecurityConfig
@RequiredArgsConstructor  // Lombok 自動生成建構子，注入 final 欄位
public class JwtAuthenticationFilter extends OncePerRequestFilter {  // 繼承 OncePerRequestFilter 確保每個請求只執行一次

    // 注入 JWT 工具類（用於驗證 Token 和提取用戶資訊）
    private final JwtUtil jwtUtil;

    /**
     * 核心過濾方法（每個 HTTP 請求都會執行這個方法）
     * @param request HTTP 請求物件（包含 Header、參數、路徑等資訊）
     * @param response HTTP 回應物件（用於設定狀態碼、回傳資料）
     * @param filterChain 過濾鏈（用於繼續執行下一個過濾器或 Controller）
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // ========== 步驟 1：從 HTTP Header 中提取 Authorization 欄位 ==========
        // 前端會在每個請求的 Header 加上：Authorization: Bearer eyJhbGc...
        String authHeader = request.getHeader("Authorization");

        // ========== 步驟 2：檢查 Header 是否存在且格式正確 ==========
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // 移除 "Bearer " 前綴，只保留 Token 本體（從第 7 個字元開始截取）
            String token = authHeader.substring(7);

            try {
                // ========== 步驟 3：驗證 Token 是否有效（未過期、簽名正確）==========
                if (jwtUtil.validateToken(token)) {
                    // ========== 步驟 4：從 Token 中提取用戶資訊 ==========
                    Long userId = jwtUtil.getUserIdFromToken(token);  // 提取用戶 ID
                    String role = jwtUtil.getRoleFromToken(token);    // 提取角色（admin 或 user）

                    // ========== 步驟 5：建立 Spring Security 的角色權限物件 ==========
                    // Spring Security 的 hasRole("ADMIN") 會自動檢查 "ROLE_ADMIN"
                    // 所以我們需要手動加上 "ROLE_" 前綴
                    List<SimpleGrantedAuthority> authorities = role != null
                            ? List.of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))  // 例如：ROLE_ADMIN
                            : Collections.emptyList();  // 沒有角色則設為空列表

                    // ========== 步驟 6：建立 Authentication 物件（Spring Security 的身份憑證）==========
                    // 這個物件會被放入 SecurityContext，後續的 Controller 可以取得當前用戶資訊
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userId,        // principal（主體）：通常是用戶 ID 或 username
                                    null,          // credentials（憑證）：密碼（JWT 不需要密碼所以設為 null）
                                    authorities    // authorities（權限）：角色列表（例如：ROLE_ADMIN）
                            );

                    // 設定請求的詳細資訊（IP 位址、Session ID 等）
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // ========== 步驟 7：將 Authentication 物件放入 SecurityContext ==========
                    // 之後 Controller 可以用 @AuthenticationPrincipal 取得 userId
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception e) {
                // ========== Token 驗證失敗（過期、簽名錯誤、格式錯誤）==========
                // 不設定 Authentication，SecurityContext 會保持空的狀態
                // 後續的 SecurityConfig 會檢查到未登入，回傳 401 Unauthorized
                logger.debug("JWT validation failed: " + e.getMessage());
            }
        }

        // ========== 步驟 8：繼續執行下一個過濾器或 Controller ==========
        // 無論 Token 是否有效，都會繼續執行（讓 SecurityConfig 決定是否放行）
        filterChain.doFilter(request, response);
    }
}
