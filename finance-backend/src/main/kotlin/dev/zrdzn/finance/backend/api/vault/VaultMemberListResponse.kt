package dev.zrdzn.finance.backend.api.vault

data class VaultMemberListResponse(
    val vaultMembers: Set<VaultMemberResponse>
)
