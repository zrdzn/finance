package dev.zrdzn.finance.backend.authentication.token.api

import dev.zrdzn.finance.backend.authentication.token.TokenId

data class RefreshTokenCreateResponse(
    val id: TokenId,
)
