package dev.zrdzn.finance.backend.api.payment

import dev.zrdzn.finance.backend.common.payment.PaymentId

data class PaymentNotFoundException(
    val paymentId: PaymentId,
    override val cause: Throwable? = null
) : RuntimeException("Payment with id $paymentId not found", cause)
