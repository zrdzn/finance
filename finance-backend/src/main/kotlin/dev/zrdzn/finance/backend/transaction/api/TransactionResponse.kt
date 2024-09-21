package dev.zrdzn.finance.backend.transaction.api

import dev.zrdzn.finance.backend.shared.Currency
import dev.zrdzn.finance.backend.transaction.TransactionId
import dev.zrdzn.finance.backend.user.UserId
import dev.zrdzn.finance.backend.vault.VaultId
import java.math.BigDecimal
import java.time.Instant

data class TransactionResponse(
    val id: TransactionId,
    val createdAt: Instant,
    val userId: UserId,
    val vaultId: VaultId,
    val transactionMethod: TransactionMethod,
    val description: String?,
    val totalInVaultCurrency: BigDecimal,
    val total: BigDecimal,
    val currency: Currency
)
