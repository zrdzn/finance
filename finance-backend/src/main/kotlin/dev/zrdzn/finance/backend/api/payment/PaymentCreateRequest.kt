package dev.zrdzn.finance.backend.api.payment

import dev.zrdzn.finance.backend.api.price.PriceCurrency
import dev.zrdzn.finance.backend.common.user.UserId
import java.math.BigDecimal

data class PaymentCreateRequest(
    val userId: UserId,
    val paymentMethod: PaymentMethod,
    val description: String?,
    val price: BigDecimal,
    val currency: PriceCurrency
)
