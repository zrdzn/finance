package dev.zrdzn.finance.backend.user.api

data class UserEmailUpdateRequest(
    val securityCode: String,
    val email: String
)
