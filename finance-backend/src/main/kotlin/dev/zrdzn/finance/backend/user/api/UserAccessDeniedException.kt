package dev.zrdzn.finance.backend.user.api

import dev.zrdzn.finance.backend.api.FinanceApiException

class UserAccessDeniedException : FinanceApiException(
    status = UserErrorCode.ACCESS_DENIED.status,
    code = UserErrorCode.ACCESS_DENIED.code,
    description = UserErrorCode.ACCESS_DENIED.description
)
