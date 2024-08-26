package dev.zrdzn.finance.backend.vault.api

import dev.zrdzn.finance.backend.payment.api.PaymentMethod
import dev.zrdzn.finance.backend.shared.Currency

data class VaultUpdateRequest(
    val name: String,
    val currency: Currency,
    val paymentMethod: PaymentMethod
)
