package dev.zrdzn.finance.backend.vault.api.member

data class VaultMemberListResponse(
    val vaultMembers: Set<VaultMemberResponse>
)
