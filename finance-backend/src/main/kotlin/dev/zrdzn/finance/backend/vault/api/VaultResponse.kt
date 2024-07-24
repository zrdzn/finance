package dev.zrdzn.finance.backend.vault.api

import dev.zrdzn.finance.backend.user.UserId
import dev.zrdzn.finance.backend.vault.VaultId
import dev.zrdzn.finance.backend.vault.VaultPublicId

data class VaultResponse(
    val id: VaultId,
    val publicId: VaultPublicId,
    val ownerId: UserId,
    val name: String,
)
