package dev.zrdzn.finance.backend.api.payment.product

import dev.zrdzn.finance.backend.api.product.ProductResponse
import dev.zrdzn.finance.backend.common.payment.PaymentId
import dev.zrdzn.finance.backend.common.payment.PaymentProductId
import java.math.BigDecimal

data class PaymentProductWithProductResponse(
    val id: PaymentProductId,
    val paymentId: PaymentId,
    val product: ProductResponse,
    val unitAmount: BigDecimal,
    val quantity: Int,
)
