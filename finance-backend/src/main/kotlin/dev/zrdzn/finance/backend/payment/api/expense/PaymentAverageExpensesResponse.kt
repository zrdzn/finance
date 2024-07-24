package dev.zrdzn.finance.backend.payment.api.expense

import dev.zrdzn.finance.backend.shared.Price

data class PaymentAverageExpensesResponse(
    val total: Price
)