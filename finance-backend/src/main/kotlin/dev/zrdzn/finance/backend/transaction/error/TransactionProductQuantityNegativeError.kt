package dev.zrdzn.finance.backend.transaction.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class TransactionProductQuantityNegativeError : FinanceApiError(
    status = TransactionErrorCode.PRODUCT_QUANTITY_NEGATIVE.status,
    code = TransactionErrorCode.PRODUCT_QUANTITY_NEGATIVE.code,
    description = TransactionErrorCode.PRODUCT_QUANTITY_NEGATIVE.description
)
