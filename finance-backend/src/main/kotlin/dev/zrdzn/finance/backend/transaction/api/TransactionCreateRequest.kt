package dev.zrdzn.finance.backend.transaction.api

import java.math.BigDecimal

data class TransactionCreateRequest(
    val vaultId: Int,
    val transactionMethod: TransactionMethod,
    val transactionType: TransactionType,
    val description: String,
    val price: BigDecimal,
    val currency: String
)
