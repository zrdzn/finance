package dev.zrdzn.finance.backend.api.payment

import dev.zrdzn.finance.backend.common.payment.PaymentProductId

data class PaymentProductCreateResponse(
    val id: PaymentProductId
)