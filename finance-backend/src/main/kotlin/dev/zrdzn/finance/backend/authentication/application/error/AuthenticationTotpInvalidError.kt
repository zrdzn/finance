package dev.zrdzn.finance.backend.authentication.application.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class AuthenticationTotpInvalidError : FinanceApiError(
    status = AuthenticationErrorCode.TOTP_INVALID.status,
    code = AuthenticationErrorCode.TOTP_INVALID.code,
    description = AuthenticationErrorCode.TOTP_INVALID.description
)
