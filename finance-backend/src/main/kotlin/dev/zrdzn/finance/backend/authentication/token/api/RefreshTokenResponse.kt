package dev.zrdzn.finance.backend.authentication.token.api

import dev.zrdzn.finance.backend.authentication.token.TokenId
import dev.zrdzn.finance.backend.user.UserId
import java.time.Instant

data class RefreshTokenResponse(
    val id: TokenId,
    val userId: UserId,
    val expiresAt: Instant
)
