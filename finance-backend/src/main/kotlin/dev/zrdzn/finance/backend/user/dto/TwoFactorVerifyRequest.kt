package dev.zrdzn.finance.backend.user.dto

data class TwoFactorVerifyRequest(
    val secret: String,
    val oneTimePassword: String
)
