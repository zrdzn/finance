package dev.zrdzn.finance.backend.transaction.api

import java.math.BigDecimal
import java.time.Instant

data class TransactionResponse(
    val id: Int,
    val createdAt: Instant,
    val userId: Int,
    val vaultId: Int,
    val transactionMethod: TransactionMethod,
    val transactionType: TransactionType,
    val description: String?,
    val totalInVaultCurrency: BigDecimal,
    val total: BigDecimal,
    val currency: String
)
