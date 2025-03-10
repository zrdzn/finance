package dev.zrdzn.finance.backend.schedule.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class ScheduleNotFoundError : FinanceApiError(
    status = ScheduleErrorCode.NOT_FOUND.status,
    code = ScheduleErrorCode.NOT_FOUND.code,
    description = ScheduleErrorCode.NOT_FOUND.description
)
