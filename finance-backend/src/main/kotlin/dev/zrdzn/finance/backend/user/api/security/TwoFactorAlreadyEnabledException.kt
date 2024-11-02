package dev.zrdzn.finance.backend.user.api.security

data class TwoFactorAlreadyEnabledException(
    override val cause: Throwable? = null
) : RuntimeException("Two-factor authentication is already enabled", cause)
