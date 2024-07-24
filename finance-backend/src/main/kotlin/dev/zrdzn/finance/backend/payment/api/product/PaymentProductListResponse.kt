package dev.zrdzn.finance.backend.payment.api.product

data class PaymentProductListResponse(
    val products: Set<PaymentProductWithProductResponse>
)
