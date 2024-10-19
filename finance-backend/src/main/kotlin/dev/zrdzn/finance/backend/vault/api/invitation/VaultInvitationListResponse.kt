package dev.zrdzn.finance.backend.vault.api.invitation

data class VaultInvitationListResponse(
    val vaultInvitations: Set<VaultInvitationResponse>
)
