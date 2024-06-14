package dev.zrdzn.finance.backend.api.payment

import dev.zrdzn.finance.backend.api.shared.Currency
import java.math.BigDecimal

data class PaymentUpdateRequest(
    val paymentMethod: PaymentMethod,
    val description: String?,
    val total: BigDecimal,
    val currency: Currency
)
