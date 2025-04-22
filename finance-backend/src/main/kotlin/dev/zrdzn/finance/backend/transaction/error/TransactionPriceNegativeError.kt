package dev.zrdzn.finance.backend.transaction.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class TransactionPriceNegativeError : FinanceApiError(
    status = TransactionErrorCode.PRICE_NEGATIVE.status,
    code = TransactionErrorCode.PRICE_NEGATIVE.code,
    description = TransactionErrorCode.PRICE_NEGATIVE.description
)
