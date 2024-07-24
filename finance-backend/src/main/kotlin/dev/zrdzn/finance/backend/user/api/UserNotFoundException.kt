package dev.zrdzn.finance.backend.user.api

import dev.zrdzn.finance.backend.user.UserId

data class UserNotFoundException(
    val userId: UserId,
    override val cause: Throwable? = null
) : RuntimeException("User with id $userId not found", cause)

data class UserNotFoundByEmailException(
    val userEmail: String,
    override val cause: Throwable? = null
) : RuntimeException("User with email $userEmail not found", cause)
