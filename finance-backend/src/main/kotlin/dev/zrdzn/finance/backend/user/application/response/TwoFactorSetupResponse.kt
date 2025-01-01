package dev.zrdzn.finance.backend.user.application.response

data class TwoFactorSetupResponse(
    val qrCodeImage: String,
    val secret: String
)
