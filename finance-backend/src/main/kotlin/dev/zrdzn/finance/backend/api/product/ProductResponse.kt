package dev.zrdzn.finance.backend.api.product

import dev.zrdzn.finance.backend.common.category.CategoryId
import dev.zrdzn.finance.backend.common.product.ProductId
import dev.zrdzn.finance.backend.common.vault.VaultId

data class ProductResponse(
    val id: ProductId,
    val name: String,
    val vaultId: VaultId,
    val categoryId: CategoryId?,
    val categoryName: String?
)
