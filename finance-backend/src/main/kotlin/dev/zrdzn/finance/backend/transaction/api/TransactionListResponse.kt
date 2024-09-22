package dev.zrdzn.finance.backend.transaction.api

data class TransactionListResponse(
    val transactions: Set<TransactionResponse>
)
