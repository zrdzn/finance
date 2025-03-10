package dev.zrdzn.finance.backend.vault.dto

import java.time.Instant

data class VaultInvitationResponse(
    val id: Int,
    val vault: VaultResponse,
    val userEmail: String,
    val expiresAt: Instant
)
