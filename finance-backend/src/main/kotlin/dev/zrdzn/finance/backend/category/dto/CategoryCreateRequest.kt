package dev.zrdzn.finance.backend.category.dto

data class CategoryCreateRequest(
    val name: String,
    val vaultId: Int
)
