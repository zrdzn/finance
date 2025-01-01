package dev.zrdzn.finance.backend.transaction.application.response

import dev.zrdzn.finance.backend.product.application.response.ProductResponse
import java.math.BigDecimal

data class TransactionProductResponse(
    val id: Int,
    val transactionId: Int,
    val product: ProductResponse,
    val unitAmount: BigDecimal,
    val quantity: Int,
)
