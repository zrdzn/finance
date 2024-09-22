package dev.zrdzn.finance.backend.vault.api

import dev.zrdzn.finance.backend.transaction.api.TransactionMethod

data class VaultCreateRequest(
    val name: String,
    val currency: String,
    val transactionMethod: TransactionMethod
)
