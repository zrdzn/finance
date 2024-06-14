package dev.zrdzn.finance.backend.api.payment.product

import dev.zrdzn.finance.backend.common.product.ProductId
import java.math.BigDecimal

data class PaymentProductCreateRequest(
    val productId: ProductId,
    val unitAmount: BigDecimal,
    val quantity: Int,
)
