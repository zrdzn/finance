package dev.zrdzn.finance.backend.transaction.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class TransactionImportFileEmptyError : FinanceApiError(
    status = TransactionErrorCode.IMPORT_FILE_EMPTY.status,
    code = TransactionErrorCode.IMPORT_FILE_EMPTY.code,
    description = TransactionErrorCode.IMPORT_FILE_EMPTY.description
)
