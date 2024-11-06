package dev.zrdzn.finance.backend.user.api.security

import dev.zrdzn.finance.backend.api.FinanceApiException

class TwoFactorAlreadyEnabledException : FinanceApiException(
    status = TwoFactorErrorCode.ALREADY_ENABLED.status,
    code = TwoFactorErrorCode.ALREADY_ENABLED.code,
    description = TwoFactorErrorCode.ALREADY_ENABLED.description
)
