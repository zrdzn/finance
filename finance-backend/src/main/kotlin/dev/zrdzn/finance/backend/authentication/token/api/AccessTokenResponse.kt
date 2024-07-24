package dev.zrdzn.finance.backend.authentication.token.api

import dev.zrdzn.finance.backend.authentication.token.TokenId
import dev.zrdzn.finance.backend.user.UserId
import java.time.Instant

data class AccessTokenResponse(
    val value: String,
    val userId: UserId,
    val refreshTokenId: TokenId,
    val email: String,
    val expiresAt: Instant
)
