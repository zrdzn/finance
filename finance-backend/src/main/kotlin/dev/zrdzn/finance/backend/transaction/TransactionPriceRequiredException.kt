package dev.zrdzn.finance.backend.transaction

import dev.zrdzn.finance.backend.api.FinanceApiException
import dev.zrdzn.finance.backend.transaction.api.TransactionErrorCode

class TransactionPriceRequiredException : FinanceApiException(
    status = TransactionErrorCode.PRICE_REQUIRED.status,
    code = TransactionErrorCode.PRICE_REQUIRED.code,
    description = TransactionErrorCode.PRICE_REQUIRED.description
)
