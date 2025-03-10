package dev.zrdzn.finance.backend.schedule.error

import org.springframework.http.HttpStatus

enum class ScheduleErrorCode(val status: Int, val code: String, val description: String) {
    NOT_FOUND(HttpStatus.NOT_FOUND.value(), "SCHEDULE_NOT_FOUND", "Schedule not found"),
}
