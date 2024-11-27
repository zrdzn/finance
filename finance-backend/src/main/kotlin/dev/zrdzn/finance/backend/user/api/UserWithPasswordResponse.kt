package dev.zrdzn.finance.backend.user.api

data class UserWithPasswordResponse(
    val id: Int,
    val email: String,
    val username: String,
    val password: String,
    val verified: Boolean,
    val totpSecret: String?
)
