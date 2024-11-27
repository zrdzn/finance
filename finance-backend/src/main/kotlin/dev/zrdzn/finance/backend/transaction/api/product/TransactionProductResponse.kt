package dev.zrdzn.finance.backend.transaction.api.product

import dev.zrdzn.finance.backend.product.api.ProductResponse
import java.math.BigDecimal

data class TransactionProductResponse(
    val id: Int,
    val transactionId: Int,
    val product: ProductResponse,
    val unitAmount: BigDecimal,
    val quantity: Int,
)
