package dev.zrdzn.finance.backend.transaction.dto

import java.math.BigDecimal

data class FlowsChartResponse(
    val categories: List<String>,
    val series: List<FlowsChartSeries>
)

data class FlowsChartSeries(
    val name: String,
    val data: List<BigDecimal>
)
