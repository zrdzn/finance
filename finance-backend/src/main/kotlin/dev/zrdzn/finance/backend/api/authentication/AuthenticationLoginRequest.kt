package dev.zrdzn.finance.backend.api.authentication

data class AuthenticationLoginRequest(
    val email: String,
    val password: String
)
