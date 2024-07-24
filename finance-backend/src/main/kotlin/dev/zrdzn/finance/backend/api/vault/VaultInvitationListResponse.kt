package dev.zrdzn.finance.backend.api.vault

data class VaultInvitationListResponse(
    val vaultInvitations: Set<VaultInvitationResponse>
)
