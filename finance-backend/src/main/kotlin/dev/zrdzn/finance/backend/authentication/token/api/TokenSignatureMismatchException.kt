package dev.zrdzn.finance.backend.authentication.token.api

data class TokenSignatureMismatchException(
    override val cause: Throwable? = null
) : RuntimeException("There is a signature mismatch for provided access token", cause)
