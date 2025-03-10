package dev.zrdzn.finance.backend.category.dto

data class CategoryResponse(
    val id: Int,
    val name: String,
    val vaultId: Int
)
