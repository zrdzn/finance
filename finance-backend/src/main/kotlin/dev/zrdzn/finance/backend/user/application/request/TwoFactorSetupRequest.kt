package dev.zrdzn.finance.backend.user.application.request

data class TwoFactorSetupRequest(
    val securityCode: String
)
