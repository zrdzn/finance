package dev.zrdzn.finance.backend.category.api

import dev.zrdzn.finance.backend.category.CategoryId
import dev.zrdzn.finance.backend.vault.VaultId

data class CategoryResponse(
    val id: CategoryId,
    val name: String,
    val vaultId: VaultId
)
