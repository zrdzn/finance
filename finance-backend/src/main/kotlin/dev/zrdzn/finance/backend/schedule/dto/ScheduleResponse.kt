package dev.zrdzn.finance.backend.schedule.dto

import dev.zrdzn.finance.backend.schedule.ScheduleInterval
import java.time.Instant

data class ScheduleResponse(
    val id: Int,
    val transactionId: Int,
    val description: String,
    val nextExecution: Instant,
    val interval: ScheduleInterval,
    val amount: Int
)
