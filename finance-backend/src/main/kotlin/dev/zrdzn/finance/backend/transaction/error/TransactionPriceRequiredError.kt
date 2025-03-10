package dev.zrdzn.finance.backend.transaction.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class TransactionPriceRequiredError : FinanceApiError(
    status = TransactionErrorCode.PRICE_REQUIRED.status,
    code = TransactionErrorCode.PRICE_REQUIRED.code,
    description = TransactionErrorCode.PRICE_REQUIRED.description
)
