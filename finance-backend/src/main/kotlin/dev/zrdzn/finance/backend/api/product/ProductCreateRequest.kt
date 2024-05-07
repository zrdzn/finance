package dev.zrdzn.finance.backend.api.product

data class ProductCreateRequest(
    val name: String,
    val vaultId: Int,
    val categoryId: Int?
)
