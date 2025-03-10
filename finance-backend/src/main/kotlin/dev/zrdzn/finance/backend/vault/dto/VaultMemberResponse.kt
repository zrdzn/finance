package dev.zrdzn.finance.backend.vault.dto

import dev.zrdzn.finance.backend.user.dto.UserResponse
import dev.zrdzn.finance.backend.vault.VaultRole

data class VaultMemberResponse(
    val id: Int,
    val vaultId: Int,
    val user: UserResponse,
    val vaultRole: VaultRole
)
