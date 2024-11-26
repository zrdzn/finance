package dev.zrdzn.finance.backend.category.api

data class CategoryCreateRequest(
    val name: String,
    val vaultId: Int
)
