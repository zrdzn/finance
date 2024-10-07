package dev.zrdzn.finance.backend.user.api

data class UserPasswordUpdateRequest(
    val securityCode: String,
    val oldPassword: String,
    val newPassword: String
)
