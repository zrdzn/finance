package dev.zrdzn.finance.backend.api.payment

import dev.zrdzn.finance.backend.api.price.Price

data class PaymentAverageExpensesResponse(
    val total: Price
)