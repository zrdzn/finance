package dev.zrdzn.finance.backend.payment.api

import dev.zrdzn.finance.backend.payment.PaymentId

data class ProductNotFoundException(
    val paymentId: PaymentId,
    override val cause: Throwable? = null
) : RuntimeException("Payment with id $paymentId not found", cause)
