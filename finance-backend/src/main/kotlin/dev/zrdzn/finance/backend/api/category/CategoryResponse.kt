package dev.zrdzn.finance.backend.api.category

import dev.zrdzn.finance.backend.common.category.CategoryId
import dev.zrdzn.finance.backend.common.vault.VaultId

data class CategoryResponse(
    val id: CategoryId,
    val name: String,
    val vaultId: VaultId
)
