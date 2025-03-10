package dev.zrdzn.finance.backend.token.dto

import java.time.Instant

data class RefreshTokenResponse(
    val id: String,
    val userId: Int,
    val expiresAt: Instant
)
