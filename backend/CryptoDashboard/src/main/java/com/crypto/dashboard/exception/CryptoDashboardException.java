package com.crypto.dashboard.exception;

/**
 * 專案基礎例外類別
 */
public class CryptoDashboardException extends RuntimeException {
    public CryptoDashboardException(String message) {
        super(message);
    }

    public CryptoDashboardException(String message, Throwable cause) {
        super(message, cause);
    }
}
