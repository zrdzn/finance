package dev.zrdzn.finance.backend.api.price

import java.math.BigDecimal

data class Price(
    val amount: BigDecimal,
    val currency: PriceCurrency
)
