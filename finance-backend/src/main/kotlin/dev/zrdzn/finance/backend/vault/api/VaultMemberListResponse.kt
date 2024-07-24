package dev.zrdzn.finance.backend.vault.api

data class VaultMemberListResponse(
    val vaultMembers: Set<VaultMemberResponse>
)
