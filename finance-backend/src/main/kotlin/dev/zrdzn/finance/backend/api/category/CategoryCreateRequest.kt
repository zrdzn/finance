package dev.zrdzn.finance.backend.api.category

import dev.zrdzn.finance.backend.common.vault.VaultId

data class CategoryCreateRequest(
    val name: String,
    val vaultId: VaultId
)
