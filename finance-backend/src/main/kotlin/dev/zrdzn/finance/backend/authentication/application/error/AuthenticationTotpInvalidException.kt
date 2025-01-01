package dev.zrdzn.finance.backend.authentication.application.error

import dev.zrdzn.finance.backend.error.FinanceApiException

class AuthenticationTotpInvalidException : FinanceApiException(
    status = AuthenticationErrorCode.TOTP_INVALID.status,
    code = AuthenticationErrorCode.TOTP_INVALID.code,
    description = AuthenticationErrorCode.TOTP_INVALID.description
)
