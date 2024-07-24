package dev.zrdzn.finance.backend.payment.api.product

import dev.zrdzn.finance.backend.payment.PaymentId
import dev.zrdzn.finance.backend.payment.PaymentProductId
import dev.zrdzn.finance.backend.product.api.ProductResponse
import java.math.BigDecimal

data class PaymentProductWithProductResponse(
    val id: PaymentProductId,
    val paymentId: PaymentId,
    val product: ProductResponse,
    val unitAmount: BigDecimal,
    val quantity: Int,
)
