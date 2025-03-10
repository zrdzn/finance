package dev.zrdzn.finance.backend.transaction.dto

import dev.zrdzn.finance.backend.transaction.TransactionMethod
import java.math.BigDecimal

data class AnalysedTransactionResponse(
    val transactionMethod: TransactionMethod,
    val products: Set<AnalysedTransactionProductResponse>,
    val description: String,
    val total: BigDecimal,
    val currency: String
)

data class AnalysedTransactionProductResponse(
    val name: String,
    val unitAmount: BigDecimal,
    val quantity: Int
)
