package dev.zrdzn.finance.backend.user.application.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class TwoFactorNotEnabledError : FinanceApiError(
    status = TwoFactorErrorCode.NOT_ENABLED.status,
    code = TwoFactorErrorCode.NOT_ENABLED.code,
    description = TwoFactorErrorCode.NOT_ENABLED.description
)
