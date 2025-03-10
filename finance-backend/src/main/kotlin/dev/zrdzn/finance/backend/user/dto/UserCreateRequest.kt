package dev.zrdzn.finance.backend.user.dto

data class UserCreateRequest(
    val email: String,
    val username: String,
    val password: String
)
