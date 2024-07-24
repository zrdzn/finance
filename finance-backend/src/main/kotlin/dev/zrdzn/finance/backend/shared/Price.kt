package dev.zrdzn.finance.backend.shared

import java.math.BigDecimal

data class Price(
    val amount: BigDecimal,
    val currency: Currency
)
