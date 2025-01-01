package dev.zrdzn.finance.backend.exchange.domain

import java.math.BigDecimal

data class ExchangeRate(
    val currency: String,
    val rate: BigDecimal
)
