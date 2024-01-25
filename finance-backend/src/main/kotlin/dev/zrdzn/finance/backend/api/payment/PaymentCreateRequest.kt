package dev.zrdzn.finance.backend.api.payment

data class PaymentCreateRequest(
    val customerId: Int,
    val paymentMethod: PaymentMethod,
    val description: String?
)
