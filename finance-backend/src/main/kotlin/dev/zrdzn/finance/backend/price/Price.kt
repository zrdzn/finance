package dev.zrdzn.finance.backend.price

import java.math.BigDecimal

data class Price(
    val amount: BigDecimal,
    val currency: String
)
