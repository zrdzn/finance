package dev.zrdzn.finance.backend.authentication.api

data class AuthenticationTotpRequiredException(
    override val cause: Throwable? = null
) : RuntimeException("You need to verify your new location with one time password from 2fa application", cause)
