package dev.zrdzn.finance.backend.vault.dto

import dev.zrdzn.finance.backend.transaction.TransactionMethod

data class VaultCreateRequest(
    val name: String,
    val currency: String,
    val transactionMethod: TransactionMethod
)
