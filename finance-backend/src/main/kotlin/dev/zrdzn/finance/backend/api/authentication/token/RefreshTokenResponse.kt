package dev.zrdzn.finance.backend.api.authentication.token

import dev.zrdzn.finance.backend.common.authentication.token.TokenId
import dev.zrdzn.finance.backend.common.user.UserId
import java.time.Instant

data class RefreshTokenResponse(
    val id: TokenId,
    val userId: UserId,
    val expiresAt: Instant
)
