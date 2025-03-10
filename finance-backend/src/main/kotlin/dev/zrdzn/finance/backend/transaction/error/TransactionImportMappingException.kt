package dev.zrdzn.finance.backend.transaction.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class TransactionImportMappingNotFoundError : FinanceApiError(
    status = TransactionErrorCode.IMPORT_MAPPING_NOT_FOUND.status,
    code = TransactionErrorCode.IMPORT_MAPPING_NOT_FOUND.code,
    description = TransactionErrorCode.IMPORT_MAPPING_NOT_FOUND.description
)
