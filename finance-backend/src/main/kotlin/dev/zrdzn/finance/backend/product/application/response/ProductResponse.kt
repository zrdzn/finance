package dev.zrdzn.finance.backend.product.application.response

data class ProductResponse(
    val id: Int,
    val name: String,
    val vaultId: Int,
    val categoryId: Int?,
    val categoryName: String?
)
