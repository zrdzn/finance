package dev.zrdzn.finance.backend.vault.api.member

import dev.zrdzn.finance.backend.user.api.UserResponse
import dev.zrdzn.finance.backend.vault.VaultId
import dev.zrdzn.finance.backend.vault.VaultMemberId
import dev.zrdzn.finance.backend.vault.api.authority.VaultRole

data class VaultMemberResponse(
    val id: VaultMemberId,
    val vaultId: VaultId,
    val user: UserResponse,
    val vaultRole: VaultRole
)
