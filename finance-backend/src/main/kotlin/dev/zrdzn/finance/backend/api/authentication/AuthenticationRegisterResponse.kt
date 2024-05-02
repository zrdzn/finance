package dev.zrdzn.finance.backend.api.authentication

import dev.zrdzn.finance.backend.common.user.UserId

data class AuthenticationRegisterResponse(
    val userId: UserId
)
