package dev.zrdzn.finance.backend.api.vault

import dev.zrdzn.finance.backend.common.vault.VaultId

data class VaultInvitationCreateRequest(
    val vaultId: VaultId,
    val userEmail: String
)
