package dev.zrdzn.finance.backend.authentication.api

data class AuthenticationCredentialsInvalidException(
    val email: String,
    override val cause: Throwable? = null
) : RuntimeException("Account with email $email does not exist or the password is incorrect", cause)
