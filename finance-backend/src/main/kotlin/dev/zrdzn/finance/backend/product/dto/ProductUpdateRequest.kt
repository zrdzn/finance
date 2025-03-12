package dev.zrdzn.finance.backend.product.dto

import java.math.BigDecimal

data class ProductUpdateRequest(
    val categoryId: Int?,
    val unitAmount: BigDecimal
)
