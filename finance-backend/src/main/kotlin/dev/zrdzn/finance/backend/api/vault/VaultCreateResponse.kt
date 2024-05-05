package dev.zrdzn.finance.backend.api.vault

import dev.zrdzn.finance.backend.common.vault.VaultId
import dev.zrdzn.finance.backend.common.vault.VaultPublicId

data class VaultCreateResponse(
    val id: VaultId,
    val publicId: VaultPublicId
)
