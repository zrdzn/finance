package dev.zrdzn.finance.backend.payment.api

import java.math.BigDecimal

data class PaymentChartDataResponse(
    val label: String,
    val value: BigDecimal
)
