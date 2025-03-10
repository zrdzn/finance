package dev.zrdzn.finance.backend.transaction.dto

import dev.zrdzn.finance.backend.transaction.TransactionMethod
import dev.zrdzn.finance.backend.transaction.TransactionType
import java.math.BigDecimal

data class TransactionUpdateRequest(
    val transactionMethod: TransactionMethod,
    val transactionType: TransactionType,
    val description: String?,
    val total: BigDecimal,
    val currency: String
)
