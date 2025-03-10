package dev.zrdzn.finance.backend.transaction.dto

import dev.zrdzn.finance.backend.transaction.TransactionMethod
import dev.zrdzn.finance.backend.transaction.TransactionType
import dev.zrdzn.finance.backend.user.dto.UserResponse
import java.math.BigDecimal
import java.time.Instant

data class TransactionResponse(
    val id: Int,
    val createdAt: Instant,
    val user: UserResponse,
    val vaultId: Int,
    val transactionMethod: TransactionMethod,
    val transactionType: TransactionType,
    val products: TransactionProductListResponse,
    val description: String?,
    val totalInVaultCurrency: BigDecimal,
    val total: BigDecimal,
    val currency: String
)
