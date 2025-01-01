package dev.zrdzn.finance.backend.user.application.response

data class UserResponse(
    val id: Int,
    val email: String,
    val username: String,
    val verified: Boolean,
    val isTwoFactorEnabled: Boolean,
    val decimalSeparator: String,
    val groupSeparator: String
)
