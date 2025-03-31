package dev.zrdzn.finance.backend.schedule.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class ScheduleAmountNegativeError : FinanceApiError(
    status = ScheduleErrorCode.AMOUNT_NEGATIVE.status,
    code = ScheduleErrorCode.AMOUNT_NEGATIVE.code,
    description = ScheduleErrorCode.AMOUNT_NEGATIVE.description
)
