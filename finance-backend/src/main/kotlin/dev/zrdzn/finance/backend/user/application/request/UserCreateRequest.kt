package dev.zrdzn.finance.backend.user.application.request

data class UserCreateRequest(
    val email: String,
    val username: String,
    val password: String
)
