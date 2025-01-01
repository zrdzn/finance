package dev.zrdzn.finance.backend.transaction.application.response

data class TransactionProductListResponse(
    val products: Set<TransactionProductResponse>
)
