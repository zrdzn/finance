package dev.zrdzn.finance.backend.product.application.request

data class ProductCreateRequest(
    val name: String,
    val vaultId: Int,
    val categoryId: Int?
)
