package dev.zrdzn.finance.backend.api.vault

import dev.zrdzn.finance.backend.api.user.UserResponse
import dev.zrdzn.finance.backend.common.user.UserId
import dev.zrdzn.finance.backend.common.vault.VaultId
import dev.zrdzn.finance.backend.common.vault.VaultMemberId

data class VaultMemberResponse(
    val id: VaultMemberId,
    val vaultId: VaultId,
    val user: UserResponse,
    val role: VaultRole
)
