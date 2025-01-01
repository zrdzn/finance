package dev.zrdzn.finance.backend.transaction.application.error

import dev.zrdzn.finance.backend.error.FinanceApiException

class TransactionImportMappingNotFoundException : FinanceApiException(
    status = TransactionErrorCode.IMPORT_MAPPING_NOT_FOUND.status,
    code = TransactionErrorCode.IMPORT_MAPPING_NOT_FOUND.code,
    description = TransactionErrorCode.IMPORT_MAPPING_NOT_FOUND.description
)
