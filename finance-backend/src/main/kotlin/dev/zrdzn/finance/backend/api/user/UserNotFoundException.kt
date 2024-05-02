package dev.zrdzn.finance.backend.api.user

import dev.zrdzn.finance.backend.common.user.UserId

data class UserNotFoundException(
    val userId: UserId,
    override val cause: Throwable? = null
) : RuntimeException("User with id $userId not found", cause)
