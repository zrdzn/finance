package dev.zrdzn.finance.backend.api.authentication.token

import dev.zrdzn.finance.backend.common.authentication.token.TokenId
import dev.zrdzn.finance.backend.common.user.UserId

data class AccessTokenCreateRequest(
    val userId: UserId,
    val refreshTokenId: TokenId,
    val email: String
)
