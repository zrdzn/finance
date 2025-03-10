package dev.zrdzn.finance.backend.authentication.error

import org.springframework.http.HttpStatus

enum class AuthenticationErrorCode(val status: Int, val code: String, val description: String) {
    TOTP_REQUIRED(HttpStatus.UNAUTHORIZED.value(), "AUTHENTICATION_TOTP_REQUIRED", "You need to verify your new location with a one-time password from the 2FA application"),
    TOTP_INVALID(HttpStatus.UNAUTHORIZED.value(), "AUTHENTICATION_TOTP_INVALID", "Provided one-time password is incorrect"),
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED.value(), "AUTHENTICATION_INVALID_CREDENTIALS", "Provided credentials are incorrect"),
    ATTEMPT_NOT_FOUND(HttpStatus.NOT_FOUND.value(), "AUTHENTICATION_ATTEMPT_NOT_FOUND", "Something went wrong with completing the authentication process"),
}
