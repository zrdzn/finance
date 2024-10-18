package dev.zrdzn.finance.backend.user.api

import dev.zrdzn.finance.backend.user.UserId

data class UserWithPasswordResponse(
    val id: UserId,
    val email: String,
    val username: String,
    val password: String,
    val verified: Boolean
)
