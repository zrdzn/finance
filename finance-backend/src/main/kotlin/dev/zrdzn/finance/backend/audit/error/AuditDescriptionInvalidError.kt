package dev.zrdzn.finance.backend.audit.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class AuditDescriptionInvalidError : FinanceApiError(
    status = AuditErrorCode.DESCRIPTION_INVALID.status,
    code = AuditErrorCode.DESCRIPTION_INVALID.code,
    description = AuditErrorCode.DESCRIPTION_INVALID.description
)
