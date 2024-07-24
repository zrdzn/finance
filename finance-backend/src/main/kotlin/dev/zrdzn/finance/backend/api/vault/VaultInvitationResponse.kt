package dev.zrdzn.finance.backend.api.vault

import dev.zrdzn.finance.backend.common.vault.VaultMemberId
import java.time.Instant

data class VaultInvitationResponse(
    val id: VaultMemberId,
    val vault: VaultResponse,
    val userEmail: String,
    val expiresAt: Instant
)
