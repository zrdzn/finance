package dev.zrdzn.finance.backend.api.payment.expense

import dev.zrdzn.finance.backend.api.price.Price

data class PaymentExpensesResponse(
    val total: Price
)