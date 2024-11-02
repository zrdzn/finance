package dev.zrdzn.finance.backend.authentication.api

data class AuthenticationTotpInvalidException(
    override val cause: Throwable? = null
) : RuntimeException("Provided one time password is invalid", cause)
