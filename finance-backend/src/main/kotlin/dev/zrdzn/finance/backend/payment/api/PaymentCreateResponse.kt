package dev.zrdzn.finance.backend.payment.api

import dev.zrdzn.finance.backend.payment.PaymentId

data class PaymentCreateResponse(
    val id: PaymentId
)
