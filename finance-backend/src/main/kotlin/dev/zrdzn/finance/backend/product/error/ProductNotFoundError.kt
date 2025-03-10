package dev.zrdzn.finance.backend.product.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class ProductNotFoundError : FinanceApiError(
    status = ProductErrorCode.NOT_FOUND.status,
    code = ProductErrorCode.NOT_FOUND.code,
    description = ProductErrorCode.NOT_FOUND.description
)
