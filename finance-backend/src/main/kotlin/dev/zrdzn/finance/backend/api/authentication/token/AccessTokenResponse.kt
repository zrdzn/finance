package dev.zrdzn.finance.backend.api.authentication.token

import dev.zrdzn.finance.backend.common.authentication.token.TokenId
import dev.zrdzn.finance.backend.common.user.UserId
import java.time.Instant

data class AccessTokenResponse(
    val value: String,
    val userId: UserId,
    val refreshTokenId: TokenId,
    val email: String,
    val expiresAt: Instant
)
