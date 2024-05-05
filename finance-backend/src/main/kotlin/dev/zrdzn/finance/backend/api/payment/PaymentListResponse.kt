package dev.zrdzn.finance.backend.api.payment

data class PaymentListResponse(
    val payments: Set<PaymentResponse>
)
