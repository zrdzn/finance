package dev.zrdzn.finance.backend.transaction.application.error

import dev.zrdzn.finance.backend.error.FinanceApiException

class TransactionDescriptionRequiredException : FinanceApiException(
    status = TransactionErrorCode.DESCRIPTION_REQUIRED.status,
    code = TransactionErrorCode.DESCRIPTION_REQUIRED.code,
    description = TransactionErrorCode.DESCRIPTION_REQUIRED.description
)
