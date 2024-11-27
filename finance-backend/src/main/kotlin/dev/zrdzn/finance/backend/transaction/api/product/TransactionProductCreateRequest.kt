package dev.zrdzn.finance.backend.transaction.api.product

import java.math.BigDecimal

data class TransactionProductCreateRequest(
    val productId: Int,
    val unitAmount: BigDecimal,
    val quantity: Int,
)
