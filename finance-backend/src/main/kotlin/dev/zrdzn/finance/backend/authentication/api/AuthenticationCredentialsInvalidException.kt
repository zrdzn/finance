package dev.zrdzn.finance.backend.authentication.api

data class AuthenticationCredentialsInvalidException(
    override val cause: Throwable? = null
) : RuntimeException("Provided credentials are incorrect", cause)
