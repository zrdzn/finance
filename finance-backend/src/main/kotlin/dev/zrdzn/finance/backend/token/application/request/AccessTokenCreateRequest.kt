package dev.zrdzn.finance.backend.token.application.request

data class AccessTokenCreateRequest(
    val userId: Int,
    val refreshTokenId: String,
    val email: String
)
