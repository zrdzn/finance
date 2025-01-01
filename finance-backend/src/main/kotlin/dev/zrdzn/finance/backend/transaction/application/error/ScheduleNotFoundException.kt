package dev.zrdzn.finance.backend.transaction.application.error

import dev.zrdzn.finance.backend.error.FinanceApiException

class ScheduleNotFoundException : FinanceApiException(
    status = TransactionErrorCode.SCHEDULE_NOT_FOUND.status,
    code = TransactionErrorCode.SCHEDULE_NOT_FOUND.code,
    description = TransactionErrorCode.SCHEDULE_NOT_FOUND.description
)
