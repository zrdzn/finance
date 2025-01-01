package dev.zrdzn.finance.backend.token.application.response

import java.time.Instant

data class AccessTokenResponse(
    val value: String,
    val userId: Int,
    val refreshTokenId: String,
    val email: String,
    val expiresAt: Instant
)
