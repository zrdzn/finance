package dev.zrdzn.finance.backend.transaction.dto

import dev.zrdzn.finance.backend.category.dto.CategoryResponse
import java.math.BigDecimal

data class TransactionProductResponse(
    val id: Int,
    val transactionId: Int,
    val name: String,
    val category: CategoryResponse?,
    val unitAmount: BigDecimal,
    val quantity: Int,
)
