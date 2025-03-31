package dev.zrdzn.finance.backend.transaction.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class TransactionProductNameInvalidError : FinanceApiError(
    status = TransactionErrorCode.PRODUCT_NAME_INVALID.status,
    code = TransactionErrorCode.PRODUCT_NAME_INVALID.code,
    description = TransactionErrorCode.PRODUCT_NAME_INVALID.description
)
