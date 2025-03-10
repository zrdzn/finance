package dev.zrdzn.finance.backend.vault.dto

data class VaultInvitationCreateRequest(
    val vaultId: Int,
    val userEmail: String
)
