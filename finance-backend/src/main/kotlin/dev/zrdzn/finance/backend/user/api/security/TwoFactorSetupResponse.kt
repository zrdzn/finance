package dev.zrdzn.finance.backend.user.api.security

data class TwoFactorSetupResponse(
    val qrCodeImage: String,
    val secret: String
)
