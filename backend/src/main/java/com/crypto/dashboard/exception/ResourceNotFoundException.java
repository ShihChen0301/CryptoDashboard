package com.crypto.dashboard.exception;

/**
 * 資源不存在例外
 */
public class ResourceNotFoundException extends CryptoDashboardException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
