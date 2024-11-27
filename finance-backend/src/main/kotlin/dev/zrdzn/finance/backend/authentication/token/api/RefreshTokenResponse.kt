package dev.zrdzn.finance.backend.authentication.token.api

import java.time.Instant

data class RefreshTokenResponse(
    val id: String,
    val userId: Int,
    val expiresAt: Instant
)
