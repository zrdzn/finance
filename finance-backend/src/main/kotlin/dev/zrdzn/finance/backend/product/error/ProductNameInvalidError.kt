package dev.zrdzn.finance.backend.product.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class ProductNameInvalidError : FinanceApiError(
    status = ProductErrorCode.NAME_INVALID.status,
    code = ProductErrorCode.NAME_INVALID.code,
    description = ProductErrorCode.NAME_INVALID.description
)
