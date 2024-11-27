package dev.zrdzn.finance.backend.authentication.token.api

data class AccessTokenCreateRequest(
    val userId: Int,
    val refreshTokenId: String,
    val email: String
)
