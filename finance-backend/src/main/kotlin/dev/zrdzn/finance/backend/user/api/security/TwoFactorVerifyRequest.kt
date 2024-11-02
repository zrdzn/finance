package dev.zrdzn.finance.backend.user.api.security

data class TwoFactorVerifyRequest(
    val secret: String,
    val oneTimePassword: String
)
