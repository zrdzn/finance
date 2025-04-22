package dev.zrdzn.finance.backend.schedule.error

import dev.zrdzn.finance.backend.transaction.TransactionService.Companion.MAX_DESCRIPTION_LENGTH
import dev.zrdzn.finance.backend.transaction.TransactionService.Companion.MIN_DESCRIPTION_LENGTH
import org.springframework.http.HttpStatus

enum class ScheduleErrorCode(val status: Int, val code: String, val description: String) {
    NOT_FOUND(HttpStatus.NOT_FOUND.value(), "SCHEDULE_NOT_FOUND", "Schedule not found"),
    DESCRIPTION_INVALID(
        status = HttpStatus.BAD_REQUEST.value(),
        code = "SCHEDULE_DESCRIPTION_INVALID",
        description = "Schedule description must be between $MIN_DESCRIPTION_LENGTH and $MAX_DESCRIPTION_LENGTH characters"
    ),
    AMOUNT_NEGATIVE(
        status = HttpStatus.BAD_REQUEST.value(),
        code = "SCHEDULE_AMOUNT_NEGATIVE",
        description = "Schedule amount cannot be negative"
    ),
}
