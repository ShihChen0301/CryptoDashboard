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
 * JWT utility with configurable secret / expiration.
 */
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    // milliseconds
    @Value("${jwt.expiration:86400000}")
    private long expiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String subject, Map<String, Object> claims) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expiration);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String generateToken(Long userId, String username) {
        Map<String, Object> claims = Map.of("username", username);
        return generateToken(String.valueOf(userId), claims);
    }

    public boolean validateToken(String token, String expectedSubject) {
        String subject = extractClaim(token, Claims::getSubject);
        Date expirationDate = extractClaim(token, Claims::getExpiration);
        return subject.equals(expectedSubject) && expirationDate.after(new Date());
    }

    public boolean validateToken(String token) {
        try {
            parseAllClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Long getUserIdFromToken(String token) {
        Claims claims = parseAllClaims(token);
        return Long.parseLong(claims.getSubject());
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        return resolver.apply(parseAllClaims(token));
    }

    private Claims parseAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public long getExpirationMillis() {
        return expiration;
    }
}
