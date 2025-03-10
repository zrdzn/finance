package dev.zrdzn.finance.backend.vault.dto

data class VaultMemberListResponse(
    val vaultMembers: Set<VaultMemberResponse>
)
