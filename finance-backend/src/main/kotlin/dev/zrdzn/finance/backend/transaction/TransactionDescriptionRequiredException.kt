package dev.zrdzn.finance.backend.transaction

import dev.zrdzn.finance.backend.api.FinanceApiException
import dev.zrdzn.finance.backend.transaction.api.TransactionErrorCode

class TransactionDescriptionRequiredException : FinanceApiException(
    status = TransactionErrorCode.DESCRIPTION_REQUIRED.status,
    code = TransactionErrorCode.DESCRIPTION_REQUIRED.code,
    description = TransactionErrorCode.DESCRIPTION_REQUIRED.description
)
