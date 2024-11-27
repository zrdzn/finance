package dev.zrdzn.finance.backend.product.api

data class ProductResponse(
    val id: Int,
    val name: String,
    val vaultId: Int,
    val categoryId: Int?,
    val categoryName: String?
)
