package dev.zrdzn.finance.backend.user.application.request

data class UserPasswordUpdateRequest(
    val securityCode: String,
    val oldPassword: String,
    val newPassword: String
)
