package dev.zrdzn.finance.backend.transaction.application.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class TransactionNotFoundError : FinanceApiError(
    status = TransactionErrorCode.NOT_FOUND.status,
    code = TransactionErrorCode.NOT_FOUND.code,
    description = TransactionErrorCode.NOT_FOUND.description
)
