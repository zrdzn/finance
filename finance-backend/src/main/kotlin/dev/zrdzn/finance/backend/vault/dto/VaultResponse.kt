package dev.zrdzn.finance.backend.vault.dto

import dev.zrdzn.finance.backend.transaction.TransactionMethod
import java.time.Instant

data class VaultResponse(
    val id: Int,
    val createdAt: Instant,
    val publicId: String,
    val ownerId: Int,
    val name: String,
    val currency: String,
    val transactionMethod: TransactionMethod
)
