package dev.zrdzn.finance.backend.payment.api

data class PaymentListResponse(
    val payments: Set<PaymentResponse>
)
