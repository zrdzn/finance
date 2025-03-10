package dev.zrdzn.finance.backend.transaction.dto

import java.math.BigDecimal

data class TransactionProductResponse(
    val id: Int,
    val transactionId: Int,
    val name: String,
    val categoryName: String?,
    val unitAmount: BigDecimal,
    val quantity: Int,
)
