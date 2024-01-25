package dev.zrdzn.finance.backend.api.user

import dev.zrdzn.finance.backend.common.user.UserId

data class UserWithPasswordResponse(
    val id: UserId,
    val email: String,
    val username: String,
    val password: String
)
