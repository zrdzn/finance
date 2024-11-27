package dev.zrdzn.finance.backend.transaction.api

import java.math.BigDecimal

data class TransactionUpdateRequest(
    val transactionMethod: TransactionMethod,
    val transactionType: TransactionType,
    val description: String?,
    val total: BigDecimal,
    val currency: String
)
