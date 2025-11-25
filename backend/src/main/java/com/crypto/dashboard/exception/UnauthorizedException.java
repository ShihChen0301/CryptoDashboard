package com.crypto.dashboard.exception;

/**
 * 未授權例外
 */
public class UnauthorizedException extends CryptoDashboardException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
