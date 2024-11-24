package dev.zrdzn.finance.backend.transaction.api.schedule

import dev.zrdzn.finance.backend.api.FinanceApiException
import dev.zrdzn.finance.backend.transaction.api.TransactionErrorCode

class ScheduleNotFoundException : FinanceApiException(
    status = TransactionErrorCode.SCHEDULE_NOT_FOUND.status,
    code = TransactionErrorCode.SCHEDULE_NOT_FOUND.code,
    description = TransactionErrorCode.SCHEDULE_NOT_FOUND.description
)
