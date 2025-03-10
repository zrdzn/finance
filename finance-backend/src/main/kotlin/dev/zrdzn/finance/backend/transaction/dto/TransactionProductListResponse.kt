package dev.zrdzn.finance.backend.transaction.dto

data class TransactionProductListResponse(
    val products: Set<TransactionProductResponse>
)
