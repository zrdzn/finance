package dev.zrdzn.finance.backend.user.api

import dev.zrdzn.finance.backend.user.UserId

data class UserResponse(
    val id: UserId,
    val email: String,
    val username: String,
    val verified: Boolean
)
