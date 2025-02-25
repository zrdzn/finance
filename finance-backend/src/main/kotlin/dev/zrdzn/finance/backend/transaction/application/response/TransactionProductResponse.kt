package dev.zrdzn.finance.backend.transaction.application.response

import java.math.BigDecimal

data class TransactionProductResponse(
    val id: Int,
    val transactionId: Int,
    val name: String,
    val unitAmount: BigDecimal,
    val quantity: Int,
)
