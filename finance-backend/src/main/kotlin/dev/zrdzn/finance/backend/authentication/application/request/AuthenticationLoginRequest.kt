package dev.zrdzn.finance.backend.authentication.application.request

data class AuthenticationLoginRequest(
    val email: String,
    val password: String,
    val oneTimePassword: String?
)
