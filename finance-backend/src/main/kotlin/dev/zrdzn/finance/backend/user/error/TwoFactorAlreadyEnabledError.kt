package dev.zrdzn.finance.backend.user.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class TwoFactorAlreadyEnabledError : FinanceApiError(
    status = TwoFactorErrorCode.ALREADY_ENABLED.status,
    code = TwoFactorErrorCode.ALREADY_ENABLED.code,
    description = TwoFactorErrorCode.ALREADY_ENABLED.description
)
