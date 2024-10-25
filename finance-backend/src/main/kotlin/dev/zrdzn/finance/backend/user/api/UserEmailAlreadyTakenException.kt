package dev.zrdzn.finance.backend.user.api

data class UserEmailAlreadyTakenException(
    override val cause: Throwable? = null
) : RuntimeException("Provided e-mail is already taken", cause)