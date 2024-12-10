package dev.zrdzn.finance.backend.transaction.api

import java.math.BigDecimal
import java.time.Instant

data class TransactionCreateRequest(
    val createdAt: Instant?,
    val vaultId: Int,
    val transactionMethod: TransactionMethod,
    val transactionType: TransactionType,
    val description: String,
    val price: BigDecimal,
    val currency: String
)
