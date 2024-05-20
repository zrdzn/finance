package dev.zrdzn.finance.backend.api.price

import dev.zrdzn.finance.backend.api.shared.Currency
import java.math.BigDecimal

data class Price(
    val amount: BigDecimal,
    val currency: Currency
)
