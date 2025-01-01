package dev.zrdzn.finance.backend.transaction.application.error

import dev.zrdzn.finance.backend.error.FinanceApiException

class TransactionPriceRequiredException : FinanceApiException(
    status = TransactionErrorCode.PRICE_REQUIRED.status,
    code = TransactionErrorCode.PRICE_REQUIRED.code,
    description = TransactionErrorCode.PRICE_REQUIRED.description
)
