package com.crypto.dashboard.service;

import com.crypto.dashboard.dto.request.LoginRequest;
import com.crypto.dashboard.dto.request.RegisterRequest;
import com.crypto.dashboard.dto.response.AuthResponse;
import com.crypto.dashboard.entity.AuthToken;
import com.crypto.dashboard.entity.User;
import com.crypto.dashboard.exception.InvalidCredentialsException;
import com.crypto.dashboard.exception.ValidationException;
import com.crypto.dashboard.repository.AuthTokenRepository;
import com.crypto.dashboard.repository.UserRepository;
import com.crypto.dashboard.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AuthTokenRepository authTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ValidationException("Email already in use");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ValidationException("Username already in use");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.user);
        user.setStatus(User.Status.active);
        user.setJoinDate(LocalDateTime.now());
        user.setLastLoginAt(LocalDateTime.now()); // 註冊時設定登入時間（註冊等於自動登入）

        user = userRepository.save(user);

        String token = issueToken(user);
        return new AuthResponse(token, toSafeUser(user));
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            throw new InvalidCredentialsException("Invalid email or password");
        }
        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // remove old tokens for this user
        authTokenRepository.deleteByUser_Id(user.getId());

        String token = issueToken(user);
        return new AuthResponse(token, toSafeUser(user));
    }

    private String issueToken(User user) {
        // 加入角色資訊到 JWT claims
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", user.getUsername());
        claims.put("role", user.getRole().name());  // 加入角色

        String token = jwtUtil.generateToken(String.valueOf(user.getId()), claims);

        LocalDateTime expiresAt = LocalDateTime.now()
                .plus(Duration.ofMillis(jwtUtil.getExpirationMillis()));

        AuthToken authToken = new AuthToken();
        authToken.setUser(user);
        authToken.setToken(token);
        authToken.setExpiresAt(expiresAt);
        authTokenRepository.save(authToken);

        return token;
    }

    @Transactional
    public void logout(String token) {
        authTokenRepository.deleteByToken(token);
    }

    private User toSafeUser(User user) {
        User safe = new User();
        safe.setId(user.getId());
        safe.setUsername(user.getUsername());
        safe.setEmail(user.getEmail());
        safe.setRole(user.getRole());
        safe.setJoinDate(user.getJoinDate());
        safe.setStatus(user.getStatus());
        safe.setLastLoginAt(user.getLastLoginAt());
        return safe;
    }
}
