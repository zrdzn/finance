package dev.zrdzn.finance.backend.vault.application.response

import dev.zrdzn.finance.backend.user.application.response.UserResponse
import dev.zrdzn.finance.backend.vault.application.VaultRole

data class VaultMemberResponse(
    val id: Int,
    val vaultId: Int,
    val user: UserResponse,
    val vaultRole: VaultRole
)
