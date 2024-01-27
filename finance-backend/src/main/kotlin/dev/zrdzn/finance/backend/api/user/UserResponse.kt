package dev.zrdzn.finance.backend.api.user

import dev.zrdzn.finance.backend.common.user.UserId

data class UserResponse(
    val id: UserId,
    val email: String,
    val username: String
)
