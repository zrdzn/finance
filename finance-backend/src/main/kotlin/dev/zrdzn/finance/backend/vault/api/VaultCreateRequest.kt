package dev.zrdzn.finance.backend.vault.api

import dev.zrdzn.finance.backend.payment.api.PaymentMethod

data class VaultCreateRequest(
    val name: String,
    val currency: String,
    val paymentMethod: PaymentMethod
)
