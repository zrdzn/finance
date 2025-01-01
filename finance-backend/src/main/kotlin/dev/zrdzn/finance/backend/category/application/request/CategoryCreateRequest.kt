package dev.zrdzn.finance.backend.category.application.request

data class CategoryCreateRequest(
    val name: String,
    val vaultId: Int
)
