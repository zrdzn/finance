package dev.zrdzn.finance.backend.transaction.api

import dev.zrdzn.finance.backend.api.FinanceApiException

class TransactionDescriptionRequiredException : FinanceApiException(
    status = TransactionErrorCode.DESCRIPTION_REQUIRED.status,
    code = TransactionErrorCode.DESCRIPTION_REQUIRED.code,
    description = TransactionErrorCode.DESCRIPTION_REQUIRED.description
)
