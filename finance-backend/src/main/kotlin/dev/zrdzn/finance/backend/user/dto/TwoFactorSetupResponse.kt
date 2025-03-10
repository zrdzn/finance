package dev.zrdzn.finance.backend.user.dto

data class TwoFactorSetupResponse(
    val qrCodeImage: String,
    val secret: String
)
