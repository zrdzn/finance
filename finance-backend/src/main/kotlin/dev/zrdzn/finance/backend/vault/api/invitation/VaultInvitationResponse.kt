package dev.zrdzn.finance.backend.vault.api.invitation

import dev.zrdzn.finance.backend.vault.VaultMemberId
import dev.zrdzn.finance.backend.vault.api.VaultResponse
import java.time.Instant

data class VaultInvitationResponse(
    val id: VaultMemberId,
    val vault: VaultResponse,
    val userEmail: String,
    val expiresAt: Instant
)
