package dev.zrdzn.finance.backend.api.payment

import dev.zrdzn.finance.backend.common.payment.PaymentId

data class PaymentCreateResponse(
    val id: PaymentId
)
