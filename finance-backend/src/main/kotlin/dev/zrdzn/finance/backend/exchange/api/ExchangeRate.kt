package dev.zrdzn.finance.backend.exchange.api

import dev.zrdzn.finance.backend.shared.Currency
import java.math.BigDecimal

data class ExchangeRate(
    val currency: Currency,
    val rate: BigDecimal
)
