package dev.zrdzn.finance.backend.vault.api

import dev.zrdzn.finance.backend.vault.VaultId

data class VaultInvitationCreateRequest(
    val vaultId: VaultId,
    val userEmail: String
)
