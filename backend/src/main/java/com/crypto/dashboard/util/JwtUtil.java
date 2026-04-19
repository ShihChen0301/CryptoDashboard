package com.crypto.dashboard.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

/**
 * JWT 工具類（負責 Token 的生成、驗證、解析）
 * 作用：這是 Spring Security 認證系統的核心工具，處理所有與 JWT 相關的操作
 * 使用演算法：HS512（HMAC-SHA512，對稱加密，安全性高）
 */
@Component  // 告訴 Spring 這是一個 Bean，可以被其他類別注入使用
public class JwtUtil {

    // ========== 配置參數（從 application.yml 讀取）==========

    /**
     * JWT 簽名密鑰（從 application.yml 的 jwt.secret 讀取）
     * 用途：用於簽署和驗證 Token，確保 Token 未被篡改
     * 安全要求：HS512 需要至少 512 位元（64 字元）的強密鑰
     */
    @Value("${jwt.secret}")
    private String secret;

    /**
     * Token 有效期限（從 application.yml 的 jwt.expiration 讀取，單位：毫秒）
     * 預設值：86400000 毫秒 = 24 小時
     * 過期後用戶需要重新登入
     */
    @Value("${jwt.expiration:86400000}")
    private long expiration;

    // ========== 私有方法：取得簽名金鑰 ==========

    /**
     * 將字串密鑰轉換為 SecretKey 物件（供 JJWT 函式庫使用）
     * @return SecretKey 物件（用於 HS512 演算法）
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    // ========== 公開方法：生成 Token ==========

    /**
     * 生成 JWT Token（通用版本，可自訂 subject 和 claims）
     * @param subject Token 的主體（通常是用戶 ID）
     * @param claims 自訂資料（例如：username, role, email）
     * @return JWT Token 字串（格式：Header.Payload.Signature）
     *
     * Token 結構範例：
     * eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiJ9.signature
     *        Header              Payload (包含 userId, role)      Signature
     */
    public String generateToken(String subject, Map<String, Object> claims) {
        Date now = new Date();  // 當前時間（Token 簽發時間）
        Date expiry = new Date(now.getTime() + expiration);  // 過期時間（當前時間 + 24 小時）

        return Jwts.builder()
                .setClaims(claims)  // 設定自訂資料（例如：username, role）
                .setSubject(subject)  // 設定主體（通常是用戶 ID）
                .setIssuedAt(now)  // 設定簽發時間
                .setExpiration(expiry)  // 設定過期時間
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)  // 使用 HS512 演算法簽名
                .compact();  // 壓縮成最終的 Token 字串
    }

    /**
     * 生成 JWT Token（簡化版本，只需傳入 userId 和 username）
     * @param userId 用戶 ID（會設定為 Token 的 subject）
     * @param username 用戶名稱（會放入 claims 中）
     * @return JWT Token 字串
     *
     * 使用場景：用戶登入成功後，AuthService 會呼叫這個方法生成 Token
     */
    public String generateToken(Long userId, String username) {
        Map<String, Object> claims = Map.of("username", username);
        return generateToken(String.valueOf(userId), claims);
    }

    // ========== 公開方法：驗證 Token ==========

    /**
     * 驗證 Token（檢查 subject 是否符合預期 + 是否過期）
     * @param token JWT Token 字串
     * @param expectedSubject 預期的 subject（通常是用戶 ID）
     * @return true = Token 有效且 subject 符合，false = 無效或過期
     *
     * 使用場景：較少使用，因為通常只需要檢查 Token 是否有效（不檢查 subject）
     */
    public boolean validateToken(String token, String expectedSubject) {
        String subject = extractClaim(token, Claims::getSubject);  // 從 Token 提取 subject
        Date expirationDate = extractClaim(token, Claims::getExpiration);  // 提取過期時間
        return subject.equals(expectedSubject) && expirationDate.after(new Date());  // 檢查 subject 是否相符 + 是否未過期
    }

    /**
     * 驗證 Token（只檢查簽名是否正確 + 是否過期）
     * @param token JWT Token 字串
     * @return true = Token 有效，false = 無效或過期
     *
     * 使用場景：JwtAuthenticationFilter 會呼叫這個方法檢查 Token 是否有效
     * 驗證失敗的原因：
     * - 簽名錯誤（Token 被篡改）
     * - Token 已過期
     * - Token 格式錯誤
     */
    public boolean validateToken(String token) {
        try {
            parseAllClaims(token);  // 嘗試解析 Token，如果失敗會拋出例外
            return true;  // 解析成功 = Token 有效
        } catch (Exception e) {
            return false;  // 解析失敗 = Token 無效
        }
    }

    // ========== 公開方法：從 Token 提取資料 ==========

    /**
     * 從 Token 中提取用戶 ID
     * @param token JWT Token 字串
     * @return 用戶 ID（Long 型別）
     *
     * 使用場景：JwtAuthenticationFilter 驗證 Token 後，會呼叫這個方法取得用戶 ID
     * 之後 Controller 可以用 @AuthenticationPrincipal Long userId 取得這個值
     */
    public Long getUserIdFromToken(String token) {
        Claims claims = parseAllClaims(token);  // 解析 Token，取得所有 claims
        return Long.parseLong(claims.getSubject());  // subject 存的是 userId（字串），轉換為 Long
    }

    /**
     * 從 Token 中提取角色（admin 或 user）
     * @param token JWT Token 字串
     * @return 角色字串（例如："admin" 或 "user"）
     *
     * 使用場景：JwtAuthenticationFilter 會呼叫這個方法取得用戶角色
     * 之後 Spring Security 會用這個角色檢查是否有權限訪問特定 API
     */
    public String getRoleFromToken(String token) {
        Claims claims = parseAllClaims(token);  // 解析 Token
        return (String) claims.get("role");  // 從 claims 中取得 "role" 欄位
    }

    /**
     * 通用方法：從 Token 中提取任意 claim（使用 Lambda 表達式）
     * @param token JWT Token 字串
     * @param resolver 提取邏輯（例如：Claims::getSubject 提取 subject）
     * @return 提取的值（型別由 resolver 決定）
     *
     * 使用範例：
     * String username = extractClaim(token, claims -> claims.get("username", String.class));
     * Date expiration = extractClaim(token, Claims::getExpiration);
     */
    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        return resolver.apply(parseAllClaims(token));  // 先解析 Token，再套用提取邏輯
    }

    // ========== 私有方法：解析 Token ==========

    /**
     * 解析 JWT Token，取得所有 claims（核心方法）
     * @param token JWT Token 字串
     * @return Claims 物件（包含 subject, expiration, role, username 等資料）
     * @throws Exception 如果 Token 無效（簽名錯誤、過期、格式錯誤）
     *
     * 內部流程：
     * 1. 使用 secret 密鑰驗證簽名
     * 2. 檢查 Token 是否過期
     * 3. 解析 Payload 中的 claims
     */
    private Claims parseAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())  // 設定簽名金鑰（用於驗證 Token）
                .build()  // 建立 Parser
                .parseClaimsJws(token)  // 解析 Token（會自動驗證簽名和過期時間）
                .getBody();  // 取得 Payload（claims）
    }

    // ========== 公開方法：取得配置資訊 ==========

    /**
     * 取得 Token 的有效期限（毫秒）
     * @return 有效期限（預設 86400000 毫秒 = 24 小時）
     *
     * 使用場景：前端可能需要知道 Token 何時過期，提前提醒用戶重新登入
     */
    public long getExpirationMillis() {
        return expiration;
    }
}
