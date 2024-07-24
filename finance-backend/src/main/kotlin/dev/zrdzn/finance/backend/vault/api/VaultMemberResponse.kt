package dev.zrdzn.finance.backend.vault.api

import dev.zrdzn.finance.backend.user.api.UserResponse
import dev.zrdzn.finance.backend.vault.VaultId
import dev.zrdzn.finance.backend.vault.VaultMemberId

data class VaultMemberResponse(
    val id: VaultMemberId,
    val vaultId: VaultId,
    val user: UserResponse,
    val role: VaultRole
)
