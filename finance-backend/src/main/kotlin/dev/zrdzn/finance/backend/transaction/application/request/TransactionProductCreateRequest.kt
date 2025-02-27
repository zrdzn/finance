package dev.zrdzn.finance.backend.transaction.application.request

import java.math.BigDecimal

data class TransactionProductCreateRequest(
    val name: String,
    val categoryId: Int?,
    val unitAmount: BigDecimal,
    val quantity: Int,
)
