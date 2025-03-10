package dev.zrdzn.finance.backend.product.dto

data class ProductResponse(
    val id: Int,
    val name: String,
    val vaultId: Int,
    val categoryId: Int?,
    val categoryName: String?
)
