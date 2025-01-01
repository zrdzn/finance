package dev.zrdzn.finance.backend.vault.application.request

import dev.zrdzn.finance.backend.transaction.domain.TransactionMethod

data class VaultUpdateRequest(
    val name: String,
    val currency: String,
    val transactionMethod: TransactionMethod
)
