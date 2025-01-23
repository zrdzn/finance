package dev.zrdzn.finance.backend.transaction.application.response

import dev.zrdzn.finance.backend.shared.Price

data class TransactionFlowsResponse(
    val total: Price,
    val count: TransactionAmountResponse
)