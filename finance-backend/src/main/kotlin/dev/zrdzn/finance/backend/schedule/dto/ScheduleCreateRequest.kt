package dev.zrdzn.finance.backend.schedule.dto

import dev.zrdzn.finance.backend.schedule.ScheduleInterval

data class ScheduleCreateRequest(
    val description: String,
    val interval: ScheduleInterval,
    val amount: Int
)
