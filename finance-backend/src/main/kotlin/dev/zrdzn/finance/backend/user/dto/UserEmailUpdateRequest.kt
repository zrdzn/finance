package dev.zrdzn.finance.backend.user.dto

data class UserEmailUpdateRequest(
    val securityCode: String,
    val email: String
)
