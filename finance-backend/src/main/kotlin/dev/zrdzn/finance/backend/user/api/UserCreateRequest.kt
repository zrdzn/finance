package dev.zrdzn.finance.backend.user.api

data class UserCreateRequest(
    val email: String,
    val username: String,
    val password: String
)
