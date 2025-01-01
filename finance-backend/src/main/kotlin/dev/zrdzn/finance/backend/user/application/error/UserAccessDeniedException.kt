package dev.zrdzn.finance.backend.user.application.error

import dev.zrdzn.finance.backend.error.FinanceApiException

class UserAccessDeniedException : FinanceApiException(
    status = UserErrorCode.ACCESS_DENIED.status,
    code = UserErrorCode.ACCESS_DENIED.code,
    description = UserErrorCode.ACCESS_DENIED.description
)
