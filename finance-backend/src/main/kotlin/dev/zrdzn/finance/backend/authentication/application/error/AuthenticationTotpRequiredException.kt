package dev.zrdzn.finance.backend.authentication.application.error

import dev.zrdzn.finance.backend.error.FinanceApiException

class AuthenticationTotpRequiredException : FinanceApiException(
    status = AuthenticationErrorCode.TOTP_REQUIRED.status,
    code = AuthenticationErrorCode.TOTP_REQUIRED.code,
    description = AuthenticationErrorCode.TOTP_REQUIRED.description
)
