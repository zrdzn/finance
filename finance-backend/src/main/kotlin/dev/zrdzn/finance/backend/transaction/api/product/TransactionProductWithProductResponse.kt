package dev.zrdzn.finance.backend.transaction.api.product

import dev.zrdzn.finance.backend.product.api.ProductResponse
import java.math.BigDecimal

data class TransactionProductWithProductResponse(
    val id: dev.zrdzn.finance.backend.transaction.TransactionProductId,
    val transactionId: dev.zrdzn.finance.backend.transaction.TransactionId,
    val product: ProductResponse,
    val unitAmount: BigDecimal,
    val quantity: Int,
)
