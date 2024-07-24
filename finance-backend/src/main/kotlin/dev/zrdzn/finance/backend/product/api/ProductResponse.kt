package dev.zrdzn.finance.backend.product.api

import dev.zrdzn.finance.backend.category.CategoryId
import dev.zrdzn.finance.backend.product.ProductId
import dev.zrdzn.finance.backend.vault.VaultId

data class ProductResponse(
    val id: ProductId,
    val name: String,
    val vaultId: VaultId,
    val categoryId: CategoryId?,
    val categoryName: String?
)
