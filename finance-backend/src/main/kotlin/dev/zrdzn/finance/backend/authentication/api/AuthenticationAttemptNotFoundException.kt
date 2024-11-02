package dev.zrdzn.finance.backend.authentication.api

data class AuthenticationAttemptNotFoundException(
    override val cause: Throwable? = null
) : RuntimeException("Authentication attempt not found", cause)
