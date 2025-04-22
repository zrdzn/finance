package dev.zrdzn.finance.backend.user.error

import dev.zrdzn.finance.backend.user.UserService.Companion.MAX_PASSWORD_LENGTH
import dev.zrdzn.finance.backend.user.UserService.Companion.MAX_USERNAME_LENGTH
import dev.zrdzn.finance.backend.user.UserService.Companion.MIN_PASSWORD_LENGTH
import dev.zrdzn.finance.backend.user.UserService.Companion.MIN_USERNAME_LENGTH
import org.springframework.http.HttpStatus

enum class UserErrorCode(val status: Int, val code: String, val description: String) {
    ACCESS_DENIED(HttpStatus.FORBIDDEN.value(), "USER_ACCESS_DENIED", "Access to user resources denied"),
    EMAIL_ALREADY_TAKEN(HttpStatus.CONFLICT.value(), "USER_EMAIL_ALREADY_TAKEN", "Email is already taken"),
    EMAIL_INVALID(HttpStatus.BAD_REQUEST.value(), "USER_EMAIL_INVALID", "Provided email is invalid"),
    USERNAME_INVALID(HttpStatus.BAD_REQUEST.value(), "USER_USERNAME_INVALID", "Username must be between $MIN_USERNAME_LENGTH and $MAX_USERNAME_LENGTH characters long"),
    PASSWORD_INVALID(HttpStatus.BAD_REQUEST.value(), "USER_PASSWORD_INVALID", "Password must be between $MIN_PASSWORD_LENGTH and $MAX_PASSWORD_LENGTH characters long"),
    DECIMAL_SEPARATOR_INVALID(HttpStatus.BAD_REQUEST.value(), "USER_DECIMAL_SEPARATOR_INVALID", "Provided decimal separator is invalid"),
    GROUP_SEPARATOR_INVALID(HttpStatus.BAD_REQUEST.value(), "USER_GROUP_SEPARATOR_INVALID", "Provided group separator is invalid"),
}
