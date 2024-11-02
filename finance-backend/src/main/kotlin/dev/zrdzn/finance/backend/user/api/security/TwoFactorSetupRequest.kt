package dev.zrdzn.finance.backend.user.api.security

data class TwoFactorSetupRequest(
    val securityCode: String
)
