package dev.zrdzn.finance.backend.vault.api

data class VaultInvitationListResponse(
    val vaultInvitations: Set<VaultInvitationResponse>
)
