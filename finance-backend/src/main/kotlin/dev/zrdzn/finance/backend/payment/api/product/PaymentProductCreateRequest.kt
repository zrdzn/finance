package dev.zrdzn.finance.backend.payment.api.product

import dev.zrdzn.finance.backend.product.ProductId
import java.math.BigDecimal

data class PaymentProductCreateRequest(
    val productId: ProductId,
    val unitAmount: BigDecimal,
    val quantity: Int,
)
