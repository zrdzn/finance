package dev.zrdzn.finance.backend.api.payment.product

data class PaymentProductListResponse(
    val products: Set<PaymentProductWithProductResponse>
)
