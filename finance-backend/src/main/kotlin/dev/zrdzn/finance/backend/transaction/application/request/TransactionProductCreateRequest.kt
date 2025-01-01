package dev.zrdzn.finance.backend.transaction.application.request

import java.math.BigDecimal

data class TransactionProductCreateRequest(
    val productId: Int,
    val unitAmount: BigDecimal,
    val quantity: Int,
)
