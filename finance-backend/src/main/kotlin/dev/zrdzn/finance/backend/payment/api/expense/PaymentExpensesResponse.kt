package dev.zrdzn.finance.backend.payment.api.expense

import dev.zrdzn.finance.backend.shared.Price

data class PaymentExpensesResponse(
    val total: Price
)