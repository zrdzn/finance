package dev.zrdzn.finance.backend.transaction.api.expense

import dev.zrdzn.finance.backend.shared.Price

data class TransactionAverageExpensesResponse(
    val total: Price
)