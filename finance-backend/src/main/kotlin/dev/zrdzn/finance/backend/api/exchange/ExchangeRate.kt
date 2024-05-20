package dev.zrdzn.finance.backend.api.exchange

import dev.zrdzn.finance.backend.api.shared.Currency
import java.math.BigDecimal

data class ExchangeRate(
    val currency: Currency,
    val rate: BigDecimal
)
