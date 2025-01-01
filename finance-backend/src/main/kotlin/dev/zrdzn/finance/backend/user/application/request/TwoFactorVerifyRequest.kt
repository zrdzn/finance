package dev.zrdzn.finance.backend.user.application.request

data class TwoFactorVerifyRequest(
    val secret: String,
    val oneTimePassword: String
)
