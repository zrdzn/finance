package dev.zrdzn.finance.backend.user.dto

data class UserPasswordUpdateRequest(
    val securityCode: String,
    val oldPassword: String,
    val newPassword: String
)
