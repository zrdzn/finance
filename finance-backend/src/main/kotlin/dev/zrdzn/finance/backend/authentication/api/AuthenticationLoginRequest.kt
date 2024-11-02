package dev.zrdzn.finance.backend.authentication.api

data class AuthenticationLoginRequest(
    val email: String,
    val password: String,
    val oneTimePassword: String?
)
