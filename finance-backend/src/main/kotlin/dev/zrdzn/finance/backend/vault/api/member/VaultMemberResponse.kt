package dev.zrdzn.finance.backend.vault.api.member

import dev.zrdzn.finance.backend.user.api.UserResponse
import dev.zrdzn.finance.backend.vault.api.authority.VaultRole

data class VaultMemberResponse(
    val id: Int,
    val vaultId: Int,
    val user: UserResponse,
    val vaultRole: VaultRole
)
