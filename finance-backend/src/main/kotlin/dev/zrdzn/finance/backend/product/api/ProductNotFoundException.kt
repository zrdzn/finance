package dev.zrdzn.finance.backend.product.api

import dev.zrdzn.finance.backend.api.FinanceApiException

class ProductNotFoundException : FinanceApiException(
    status = ProductErrorCode.NOT_FOUND.status,
    code = ProductErrorCode.NOT_FOUND.code,
    description = ProductErrorCode.NOT_FOUND.description
)
