package com.crypto.dashboard.exception;

/**
 * 驗證錯誤例外
 */
public class ValidationException extends CryptoDashboardException {
    public ValidationException(String message) {
        super(message);
    }
}
