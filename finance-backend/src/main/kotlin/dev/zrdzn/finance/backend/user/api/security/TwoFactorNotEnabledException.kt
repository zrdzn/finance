package dev.zrdzn.finance.backend.user.api.security

data class TwoFactorNotEnabledException(
    override val cause: Throwable? = null
) : RuntimeException("Two-factor authentication is not enabled", cause)
