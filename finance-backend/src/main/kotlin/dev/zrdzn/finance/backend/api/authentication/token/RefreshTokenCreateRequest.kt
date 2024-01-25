package dev.zrdzn.finance.backend.api.authentication.token

import dev.zrdzn.finance.backend.common.user.UserId

data class RefreshTokenCreateRequest(
    val userId: UserId
)
