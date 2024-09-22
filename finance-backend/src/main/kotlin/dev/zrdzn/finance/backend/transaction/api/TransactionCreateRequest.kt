package dev.zrdzn.finance.backend.transaction.api

import dev.zrdzn.finance.backend.shared.Currency
import dev.zrdzn.finance.backend.vault.VaultId
import java.math.BigDecimal

data class TransactionCreateRequest(
    val vaultId: VaultId,
    val transactionMethod: TransactionMethod,
    val transactionType: TransactionType,
    val description: String?,
    val price: BigDecimal,
    val currency: Currency
)
