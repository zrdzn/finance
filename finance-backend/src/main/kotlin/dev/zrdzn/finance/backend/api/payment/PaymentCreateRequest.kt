package dev.zrdzn.finance.backend.api.payment

import dev.zrdzn.finance.backend.api.price.PriceCurrency
import java.math.BigDecimal

data class PaymentCreateRequest(
    val customerId: Int,
    val paymentMethod: PaymentMethod,
    val description: String?,
    val price: BigDecimal,
    val currency: PriceCurrency
)
