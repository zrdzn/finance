package dev.zrdzn.finance.backend.api.user

data class UserCreateRequest(
    val email: String,
    val username: String,
    val password: String
)
