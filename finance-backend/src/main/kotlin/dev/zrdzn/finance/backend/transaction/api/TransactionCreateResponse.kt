package dev.zrdzn.finance.backend.transaction.api

import dev.zrdzn.finance.backend.transaction.TransactionId

data class TransactionCreateResponse(
    val id: TransactionId
)
