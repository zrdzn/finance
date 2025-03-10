package dev.zrdzn.finance.backend.token.dto

data class AccessTokenCreateRequest(
    val userId: Int,
    val refreshTokenId: String,
    val email: String
)
