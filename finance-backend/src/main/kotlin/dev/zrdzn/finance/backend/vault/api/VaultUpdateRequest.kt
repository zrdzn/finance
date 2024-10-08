package dev.zrdzn.finance.backend.vault.api

import dev.zrdzn.finance.backend.shared.Currency
import dev.zrdzn.finance.backend.transaction.api.TransactionMethod

data class VaultUpdateRequest(
    val name: String,
    val currency: Currency,
    val transactionMethod: TransactionMethod
)
