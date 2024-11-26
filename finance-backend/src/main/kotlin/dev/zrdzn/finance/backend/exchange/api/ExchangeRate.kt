package dev.zrdzn.finance.backend.exchange.api

import java.math.BigDecimal

data class ExchangeRate(
    val currency: String,
    val rate: BigDecimal
)
