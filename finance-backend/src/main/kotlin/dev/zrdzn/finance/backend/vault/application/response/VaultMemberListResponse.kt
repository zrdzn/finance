package dev.zrdzn.finance.backend.vault.application.response

data class VaultMemberListResponse(
    val vaultMembers: Set<VaultMemberResponse>
)
