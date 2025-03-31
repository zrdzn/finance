package dev.zrdzn.finance.backend.transaction.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class TransactionProductPriceNegativeError : FinanceApiError(
    status = TransactionErrorCode.PRODUCT_PRICE_NEGATIVE.status,
    code = TransactionErrorCode.PRODUCT_PRICE_NEGATIVE.code,
    description = TransactionErrorCode.PRODUCT_PRICE_NEGATIVE.description
)
