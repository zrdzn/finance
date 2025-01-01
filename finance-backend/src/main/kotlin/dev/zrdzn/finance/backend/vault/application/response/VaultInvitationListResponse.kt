package dev.zrdzn.finance.backend.vault.application.response

data class VaultInvitationListResponse(
    val vaultInvitations: Set<VaultInvitationResponse>
)
