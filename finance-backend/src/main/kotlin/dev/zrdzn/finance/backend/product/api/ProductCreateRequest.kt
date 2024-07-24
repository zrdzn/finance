package dev.zrdzn.finance.backend.product.api

data class ProductCreateRequest(
    val name: String,
    val vaultId: Int,
    val categoryId: Int?
)
