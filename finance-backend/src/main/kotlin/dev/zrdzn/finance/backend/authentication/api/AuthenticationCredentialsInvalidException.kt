package dev.zrdzn.finance.backend.authentication.api

data class AuthenticationCredentialsInvalidException(
    val email: String,
    override val cause: Throwable? = null
) : RuntimeException("Invalid authentication credentials for email: $email.", cause)
