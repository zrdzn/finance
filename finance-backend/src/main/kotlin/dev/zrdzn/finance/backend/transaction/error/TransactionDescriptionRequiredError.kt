package dev.zrdzn.finance.backend.transaction.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class TransactionDescriptionRequiredError : FinanceApiError(
    status = TransactionErrorCode.DESCRIPTION_REQUIRED.status,
    code = TransactionErrorCode.DESCRIPTION_REQUIRED.code,
    description = TransactionErrorCode.DESCRIPTION_REQUIRED.description
)
