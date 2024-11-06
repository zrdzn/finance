package dev.zrdzn.finance.backend.category.api

import dev.zrdzn.finance.backend.api.FinanceApiException

class CategoryNotFoundException : FinanceApiException(
    status = CategoryErrorCode.NOT_FOUND.status,
    code = CategoryErrorCode.NOT_FOUND.code,
    description = CategoryErrorCode.NOT_FOUND.description
)
