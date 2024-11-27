package dev.zrdzn.finance.backend.vault.api.invitation

data class VaultInvitationCreateRequest(
    val vaultId: Int,
    val userEmail: String
)
