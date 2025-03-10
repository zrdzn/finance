package dev.zrdzn.finance.backend.transaction.dto

import dev.zrdzn.finance.backend.shared.Price

data class TransactionFlowsResponse(
    val total: Price,
    val count: TransactionAmountResponse
)