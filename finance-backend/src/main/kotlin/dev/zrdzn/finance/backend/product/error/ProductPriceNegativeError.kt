package dev.zrdzn.finance.backend.product.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class ProductPriceNegativeError : FinanceApiError(
    status = ProductErrorCode.PRICE_NEGATIVE.status,
    code = ProductErrorCode.PRICE_NEGATIVE.code,
    description = ProductErrorCode.PRICE_NEGATIVE.description
)
