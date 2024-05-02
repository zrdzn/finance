package dev.zrdzn.finance.backend.api.authentication.token

data class TokenSignatureMismatchException(
    val accessToken: String,
    override val cause: Throwable? = null
) : RuntimeException("There is a signature mismatch for access token $accessToken", cause)
