package dev.zrdzn.finance.backend.api.payment

data class PaymentProductListResponse(
    val products: Set<PaymentProductWithProductResponse>
)
