package dev.zrdzn.finance.backend.user.api

data class UserResponse(
    val id: Int,
    val email: String,
    val username: String,
    val verified: Boolean,
    val isTwoFactorEnabled: Boolean
)
