package dev.zrdzn.finance.backend.user.api.security

import org.springframework.http.HttpStatus

enum class TwoFactorErrorCode(val status: Int, val code: String, val description: String) {
    ALREADY_ENABLED(HttpStatus.CONFLICT.value(), "TWO_FACTOR_ALREADY_ENABLED", "Two-factor authentication is already enabled"),
    NOT_ENABLED(HttpStatus.BAD_REQUEST.value(), "TWO_FACTOR_NOT_ENABLED", "Two-factor authentication is not enabled"),
}
