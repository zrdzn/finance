package dev.zrdzn.finance.backend.user.application.request

data class UserEmailUpdateRequest(
    val securityCode: String,
    val email: String
)
