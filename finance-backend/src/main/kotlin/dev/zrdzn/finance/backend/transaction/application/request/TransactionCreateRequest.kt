package dev.zrdzn.finance.backend.transaction.application.request

import dev.zrdzn.finance.backend.transaction.domain.TransactionMethod
import dev.zrdzn.finance.backend.transaction.domain.TransactionType
import java.math.BigDecimal

data class TransactionCreateRequest(
    val vaultId: Int,
    val transactionMethod: TransactionMethod,
    val transactionType: TransactionType,
    val description: String,
    val price: BigDecimal,
    val currency: String
)
