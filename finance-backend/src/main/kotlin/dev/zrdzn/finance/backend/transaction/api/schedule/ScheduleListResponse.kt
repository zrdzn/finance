package dev.zrdzn.finance.backend.transaction.api.schedule

data class ScheduleListResponse(
    val schedules: Set<ScheduleResponse>
)
