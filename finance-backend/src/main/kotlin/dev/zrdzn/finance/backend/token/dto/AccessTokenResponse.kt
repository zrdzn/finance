package dev.zrdzn.finance.backend.token.dto

import java.time.Instant

data class AccessTokenResponse(
    val value: String,
    val userId: Int,
    val refreshTokenId: String,
    val email: String,
    val expiresAt: Instant
)
