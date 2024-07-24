package dev.zrdzn.finance.backend.category.api

import dev.zrdzn.finance.backend.vault.VaultId

data class CategoryCreateRequest(
    val name: String,
    val vaultId: VaultId
)
