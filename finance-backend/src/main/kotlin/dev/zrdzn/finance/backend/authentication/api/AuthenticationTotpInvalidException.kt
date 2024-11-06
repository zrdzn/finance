package dev.zrdzn.finance.backend.authentication.api

import dev.zrdzn.finance.backend.api.FinanceApiException

class AuthenticationTotpInvalidException : FinanceApiException(
    status = AuthenticationErrorCode.TOTP_INVALID.status,
    code = AuthenticationErrorCode.TOTP_INVALID.code,
    description = AuthenticationErrorCode.TOTP_INVALID.description
)
