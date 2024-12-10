package dev.zrdzn.finance.backend.transaction.api.flow

import dev.zrdzn.finance.backend.price.Price

data class TransactionFlowsResponse(
    val total: Price
)