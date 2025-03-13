package dev.zrdzn.finance.backend.product.dto

import dev.zrdzn.finance.backend.category.dto.CategoryResponse
import java.math.BigDecimal

data class ProductResponse(
    val id: Int,
    val name: String,
    val vaultId: Int,
    val category: CategoryResponse?,
    val unitAmount: BigDecimal
)
