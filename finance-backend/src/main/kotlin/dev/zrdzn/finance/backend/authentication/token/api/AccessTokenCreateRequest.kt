package dev.zrdzn.finance.backend.authentication.token.api

import dev.zrdzn.finance.backend.authentication.token.TokenId
import dev.zrdzn.finance.backend.user.UserId

data class AccessTokenCreateRequest(
    val userId: UserId,
    val refreshTokenId: TokenId,
    val email: String
)
