package dev.zrdzn.finance.backend.api.payment

import dev.zrdzn.finance.backend.api.price.Price

data class PaymentExpensesResponse(
    val total: Price
)