package dev.zrdzn.finance.backend.product.dto

data class ProductCreateRequest(
    val name: String,
    val vaultId: Int,
    val categoryId: Int?
)
