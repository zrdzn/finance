package dev.zrdzn.finance.backend.user.dto

data class TwoFactorSetupRequest(
    val securityCode: String
)
