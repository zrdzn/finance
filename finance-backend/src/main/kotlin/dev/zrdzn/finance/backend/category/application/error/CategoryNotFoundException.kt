package dev.zrdzn.finance.backend.category.application.error

import dev.zrdzn.finance.backend.error.FinanceApiException

class CategoryNotFoundException : FinanceApiException(
    status = CategoryErrorCode.NOT_FOUND.status,
    code = CategoryErrorCode.NOT_FOUND.code,
    description = CategoryErrorCode.NOT_FOUND.description
)
