package dev.zrdzn.finance.backend.category.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class CategoryNameInvalidError : FinanceApiError(
    status = CategoryErrorCode.NAME_INVALID.status,
    code = CategoryErrorCode.NAME_INVALID.code,
    description = CategoryErrorCode.NAME_INVALID.description
)
