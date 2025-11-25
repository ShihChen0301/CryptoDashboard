package com.crypto.dashboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * CryptoDashboard 主程式
 * 加密貨幣儀表板後端 API
 */
@SpringBootApplication
@EnableJpaAuditing
public class CryptoDashboardApplication {

    public static void main(String[] args) {
        SpringApplication.run(CryptoDashboardApplication.class, args);
        System.out.println("========================================");
        System.out.println("CryptoDashboard Backend 啟動成功！");
        System.out.println("API 位址: http://localhost:8080/api");
        System.out.println("========================================");
    }
}
