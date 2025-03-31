package dev.zrdzn.finance.backend.schedule.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class ScheduleDescriptionInvalidError : FinanceApiError(
    status = ScheduleErrorCode.DESCRIPTION_INVALID.status,
    code = ScheduleErrorCode.DESCRIPTION_INVALID.code,
    description = ScheduleErrorCode.DESCRIPTION_INVALID.description
)
