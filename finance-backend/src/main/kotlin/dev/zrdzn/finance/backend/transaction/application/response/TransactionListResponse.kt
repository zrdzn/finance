package dev.zrdzn.finance.backend.transaction.application.response

data class TransactionListResponse(
    val transactions: Set<TransactionResponse>
)
