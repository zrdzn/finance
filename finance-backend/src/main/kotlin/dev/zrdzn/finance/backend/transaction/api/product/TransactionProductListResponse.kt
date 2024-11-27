package dev.zrdzn.finance.backend.transaction.api.product

data class TransactionProductListResponse(
    val products: Set<TransactionProductResponse>
)
