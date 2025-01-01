package dev.zrdzn.finance.backend.vault.application.request

data class VaultInvitationCreateRequest(
    val vaultId: Int,
    val userEmail: String
)
