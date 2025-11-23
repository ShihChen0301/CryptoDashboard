package com.crypto.dashboard.exception;

/**
 * 登入憑證錯誤
 */
public class InvalidCredentialsException extends CryptoDashboardException {
    public InvalidCredentialsException(String message) {
        super(message);
    }
}
