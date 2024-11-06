package dev.zrdzn.finance.backend.transaction.api

import dev.zrdzn.finance.backend.api.FinanceApiException

class TransactionNotFoundException : FinanceApiException(
    status = TransactionErrorCode.NOT_FOUND.status,
    code = TransactionErrorCode.NOT_FOUND.code,
    description = TransactionErrorCode.NOT_FOUND.description
)
