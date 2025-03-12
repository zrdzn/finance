package dev.zrdzn.finance.backend.product.dto

import java.math.BigDecimal

data class ProductResponse(
    val id: Int,
    val name: String,
    val vaultId: Int,
    val categoryId: Int?,
    val categoryName: String?,
    val unitAmount: BigDecimal
)
