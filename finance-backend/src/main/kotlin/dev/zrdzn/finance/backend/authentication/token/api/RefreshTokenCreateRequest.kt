package dev.zrdzn.finance.backend.authentication.token.api

import dev.zrdzn.finance.backend.user.UserId

data class RefreshTokenCreateRequest(
    val userId: UserId
)
