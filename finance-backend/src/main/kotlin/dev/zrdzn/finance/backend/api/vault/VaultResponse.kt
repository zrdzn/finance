package dev.zrdzn.finance.backend.api.vault

import dev.zrdzn.finance.backend.common.user.UserId
import dev.zrdzn.finance.backend.common.vault.VaultId
import dev.zrdzn.finance.backend.common.vault.VaultPublicId

data class VaultResponse(
    val id: VaultId,
    val publicId: VaultPublicId,
    val ownerId: UserId,
    val name: String,
)
