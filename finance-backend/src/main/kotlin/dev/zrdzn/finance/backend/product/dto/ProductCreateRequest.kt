package dev.zrdzn.finance.backend.product.dto

import java.math.BigDecimal

data class ProductCreateRequest(
    val name: String,
    val vaultId: Int,
    val categoryId: Int?,
    val unitAmount: BigDecimal
)
