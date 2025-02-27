package dev.zrdzn.finance.backend.transaction.application.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class TransactionProductNotFoundError : FinanceApiError(
    status = TransactionErrorCode.PRODUCT_NOT_FOUND.status,
    code = TransactionErrorCode.PRODUCT_NOT_FOUND.code,
    description = TransactionErrorCode.PRODUCT_NOT_FOUND.description
)
