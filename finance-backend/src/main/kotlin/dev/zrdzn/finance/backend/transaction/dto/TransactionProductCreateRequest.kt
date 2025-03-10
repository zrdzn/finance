package dev.zrdzn.finance.backend.transaction.dto

import java.math.BigDecimal

data class TransactionProductCreateRequest(
    val name: String,
    val categoryId: Int?,
    val unitAmount: BigDecimal,
    val quantity: Int,
)
