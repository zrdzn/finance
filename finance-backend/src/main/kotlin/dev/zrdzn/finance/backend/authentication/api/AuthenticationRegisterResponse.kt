package dev.zrdzn.finance.backend.authentication.api

import dev.zrdzn.finance.backend.user.UserId

data class AuthenticationRegisterResponse(
    val userId: UserId
)
