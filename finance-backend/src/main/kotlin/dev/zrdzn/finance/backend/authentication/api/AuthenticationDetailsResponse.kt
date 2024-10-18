package dev.zrdzn.finance.backend.authentication.api

data class AuthenticationDetailsResponse(
    val email: String,
    val username: String,
    val verified: Boolean
)
