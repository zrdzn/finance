package dev.zrdzn.finance.backend.api.authentication.token

import dev.zrdzn.finance.backend.common.authentication.token.TokenId

data class RefreshTokenCreateResponse(
    val id: TokenId,
    val value: String,
)
