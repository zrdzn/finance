package dev.zrdzn.finance.backend.transaction.application.request

import dev.zrdzn.finance.backend.transaction.domain.ScheduleInterval

data class ScheduleCreateRequest(
    val description: String,
    val interval: ScheduleInterval,
    val amount: Int
)
