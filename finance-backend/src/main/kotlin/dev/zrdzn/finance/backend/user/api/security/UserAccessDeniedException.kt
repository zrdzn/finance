package dev.zrdzn.finance.backend.user.api.security

import dev.zrdzn.finance.backend.user.UserId

data class UserAccessDeniedException(
    val userId: UserId,
    override val cause: Throwable? = null
) : RuntimeException("Access to user resources denied", cause)
