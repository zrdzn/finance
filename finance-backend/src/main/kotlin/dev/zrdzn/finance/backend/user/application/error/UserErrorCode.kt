package dev.zrdzn.finance.backend.user.application.error

import org.springframework.http.HttpStatus

enum class UserErrorCode(val status: Int, val code: String, val description: String) {
    NOT_FOUND(HttpStatus.NOT_FOUND.value(), "USER_NOT_FOUND", "User not found"),
    NOT_FOUND_BY_EMAIL(HttpStatus.NOT_FOUND.value(), "USER_NOT_FOUND_BY_EMAIL", "User not found by email"),
    ACCESS_DENIED(HttpStatus.FORBIDDEN.value(), "USER_ACCESS_DENIED", "Access to user resources denied"),
    EMAIL_ALREADY_TAKEN(HttpStatus.CONFLICT.value(), "USER_EMAIL_ALREADY_TAKEN", "Email is already taken"),
}
