package dev.zrdzn.finance.backend.product.api

import dev.zrdzn.finance.backend.product.ProductId

data class ProductCreateResponse(
    val id: ProductId,
    val name: String,
    val vaultId: Int,
    val categoryId: Int?
)
