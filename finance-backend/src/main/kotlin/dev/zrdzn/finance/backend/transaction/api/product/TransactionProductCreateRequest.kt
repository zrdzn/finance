package dev.zrdzn.finance.backend.transaction.api.product

import dev.zrdzn.finance.backend.product.ProductId
import java.math.BigDecimal

data class TransactionProductCreateRequest(
    val productId: ProductId,
    val unitAmount: BigDecimal,
    val quantity: Int,
)
