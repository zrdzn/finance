package dev.zrdzn.finance.backend.user.application.error

import dev.zrdzn.finance.backend.error.FinanceApiException

class TwoFactorNotEnabledException : FinanceApiException(
    status = TwoFactorErrorCode.NOT_ENABLED.status,
    code = TwoFactorErrorCode.NOT_ENABLED.code,
    description = TwoFactorErrorCode.NOT_ENABLED.description
)
