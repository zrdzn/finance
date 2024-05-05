package dev.zrdzn.finance.backend.api.payment

import dev.zrdzn.finance.backend.api.price.PriceCurrency
import java.math.BigDecimal

data class PaymentResponse(
    val id: Int,
    val userId: Int,
    val vaultId: Int,
    val payedAt: String,
    val paymentMethod: PaymentMethod,
    val description: String?,
    val total: BigDecimal,
    val currency: PriceCurrency
)
