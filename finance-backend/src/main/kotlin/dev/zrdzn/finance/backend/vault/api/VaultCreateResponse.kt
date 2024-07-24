package dev.zrdzn.finance.backend.vault.api

import dev.zrdzn.finance.backend.vault.VaultId
import dev.zrdzn.finance.backend.vault.VaultPublicId

data class VaultCreateResponse(
    val id: VaultId,
    val publicId: VaultPublicId
)
