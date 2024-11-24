package dev.zrdzn.finance.backend.transaction.api.schedule

data class ScheduleCreateRequest(
    val description: String,
    val interval: ScheduleInterval,
    val amount: Int
)
