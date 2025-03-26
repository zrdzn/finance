package dev.zrdzn.finance.backend.user.error

import org.springframework.http.HttpStatus

enum class UserErrorCode(val status: Int, val code: String, val description: String) {
    ACCESS_DENIED(HttpStatus.FORBIDDEN.value(), "USER_ACCESS_DENIED", "Access to user resources denied"),
    EMAIL_ALREADY_TAKEN(HttpStatus.CONFLICT.value(), "USER_EMAIL_ALREADY_TAKEN", "Email is already taken"),
    EMAIL_INVALID(HttpStatus.BAD_REQUEST.value(), "USER_EMAIL_INVALID", "Provided email is invalid"),
    USERNAME_TOO_SHORT(HttpStatus.BAD_REQUEST.value(), "USER_USERNAME_TOO_SHORT", "Provided username is too short"),
    USERNAME_TOO_LONG(HttpStatus.BAD_REQUEST.value(), "USER_USERNAME_TOO_LONG", "Provided username is too long"),
    PASSWORD_TOO_SHORT(HttpStatus.BAD_REQUEST.value(), "USER_PASSWORD_TOO_SHORT", "Provided password is too short"),
    PASSWORD_TOO_LONG(HttpStatus.BAD_REQUEST.value(), "USER_PASSWORD_TOO_LONG", "Provided password is too long"),
    DECIMAL_SEPARATOR_INVALID(HttpStatus.BAD_REQUEST.value(), "USER_DECIMAL_SEPARATOR_INVALID", "Provided decimal separator is invalid"),
    GROUP_SEPARATOR_INVALID(HttpStatus.BAD_REQUEST.value(), "USER_GROUP_SEPARATOR_INVALID", "Provided group separator is invalid"),
}
