package dev.zrdzn.finance.backend.authentication.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class AuthenticationTotpRequiredError : FinanceApiError(
    status = AuthenticationErrorCode.TOTP_REQUIRED.status,
    code = AuthenticationErrorCode.TOTP_REQUIRED.code,
    description = AuthenticationErrorCode.TOTP_REQUIRED.description
)
