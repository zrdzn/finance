package dev.zrdzn.finance.backend.user.application.error

import dev.zrdzn.finance.backend.error.FinanceApiException

class TwoFactorAlreadyEnabledException : FinanceApiException(
    status = TwoFactorErrorCode.ALREADY_ENABLED.status,
    code = TwoFactorErrorCode.ALREADY_ENABLED.code,
    description = TwoFactorErrorCode.ALREADY_ENABLED.description
)
