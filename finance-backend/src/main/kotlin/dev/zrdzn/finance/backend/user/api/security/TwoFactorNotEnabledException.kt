package dev.zrdzn.finance.backend.user.api.security

import dev.zrdzn.finance.backend.api.FinanceApiException

class TwoFactorNotEnabledException : FinanceApiException(
    status = TwoFactorErrorCode.NOT_ENABLED.status,
    code = TwoFactorErrorCode.NOT_ENABLED.code,
    description = TwoFactorErrorCode.NOT_ENABLED.description
)
