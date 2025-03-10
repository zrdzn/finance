package dev.zrdzn.finance.backend.transaction.dto

data class TransactionListResponse(
    val transactions: Set<TransactionResponse>
)
