package dev.zrdzn.finance.backend.transaction.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class TransactionDescriptionInvalidError : FinanceApiError(
    status = TransactionErrorCode.DESCRIPTION_INVALID.status,
    code = TransactionErrorCode.DESCRIPTION_INVALID.code,
    description = TransactionErrorCode.DESCRIPTION_INVALID.description
)
