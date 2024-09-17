package dev.zrdzn.finance.backend.payment.api

import java.math.BigDecimal
import java.time.Instant

data class PaymentRawChartData(
    val period: Instant,
    val value: BigDecimal
)
