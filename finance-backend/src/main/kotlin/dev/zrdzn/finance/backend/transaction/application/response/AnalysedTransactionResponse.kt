package dev.zrdzn.finance.backend.transaction.application.response

import dev.zrdzn.finance.backend.transaction.domain.TransactionMethod
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
