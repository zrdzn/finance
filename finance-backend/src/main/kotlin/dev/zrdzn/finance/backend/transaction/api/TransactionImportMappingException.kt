package dev.zrdzn.finance.backend.transaction.api

import dev.zrdzn.finance.backend.api.FinanceApiException

class TransactionImportMappingNotFoundException : FinanceApiException(
    status = TransactionErrorCode.IMPORT_MAPPING_NOT_FOUND.status,
    code = TransactionErrorCode.IMPORT_MAPPING_NOT_FOUND.code,
    description = TransactionErrorCode.IMPORT_MAPPING_NOT_FOUND.description
)
