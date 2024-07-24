package dev.zrdzn.finance.backend.payment.api

import dev.zrdzn.finance.backend.shared.Currency
import java.math.BigDecimal

data class PaymentUpdateRequest(
    val paymentMethod: PaymentMethod,
    val description: String?,
    val total: BigDecimal,
    val currency: Currency
)
