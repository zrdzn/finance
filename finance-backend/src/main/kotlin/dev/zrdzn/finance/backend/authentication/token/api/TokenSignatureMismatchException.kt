package dev.zrdzn.finance.backend.authentication.token.api

data class TokenSignatureMismatchException(
    val accessToken: String,
    override val cause: Throwable? = null
) : RuntimeException("There is a signature mismatch for access token $accessToken", cause)
