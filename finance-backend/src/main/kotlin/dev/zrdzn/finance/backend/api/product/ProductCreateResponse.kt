package dev.zrdzn.finance.backend.api.product

import dev.zrdzn.finance.backend.common.product.ProductId

data class ProductCreateResponse(
    val id: ProductId,
    val name: String,
    val vaultId: Int,
    val categoryId: Int?
)
