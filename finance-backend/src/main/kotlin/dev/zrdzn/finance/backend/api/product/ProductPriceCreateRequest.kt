package dev.zrdzn.finance.backend.api.product

import dev.zrdzn.finance.backend.api.price.PriceCurrency
import java.math.BigDecimal

data class ProductPriceCreateRequest(
    val unitAmount: BigDecimal,
    val currency: PriceCurrency
)
