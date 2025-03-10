package dev.zrdzn.finance.backend.authentication.dto

data class AuthenticationLoginRequest(
    val email: String,
    val password: String,
    val oneTimePassword: String?
)
