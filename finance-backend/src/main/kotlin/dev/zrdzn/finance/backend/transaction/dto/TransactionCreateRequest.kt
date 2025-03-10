package dev.zrdzn.finance.backend.transaction.dto

import dev.zrdzn.finance.backend.transaction.TransactionMethod
import dev.zrdzn.finance.backend.transaction.TransactionType
import java.math.BigDecimal

data class TransactionCreateRequest(
    val vaultId: Int,
    val transactionMethod: TransactionMethod,
    val transactionType: TransactionType,
    val description: String,
    val price: BigDecimal,
    val currency: String,
    val products: Set<TransactionProductCreateRequest>
)
