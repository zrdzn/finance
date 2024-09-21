package dev.zrdzn.finance.backend.transaction.api

import dev.zrdzn.finance.backend.transaction.TransactionId

data class TransactionNotFoundException(
    val transactionId: TransactionId,
    override val cause: Throwable? = null
) : RuntimeException("Transaction with id $transactionId not found", cause)
