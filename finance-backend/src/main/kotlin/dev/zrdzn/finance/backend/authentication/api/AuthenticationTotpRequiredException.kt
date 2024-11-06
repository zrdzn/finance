package dev.zrdzn.finance.backend.authentication.api

import dev.zrdzn.finance.backend.api.FinanceApiException

class AuthenticationTotpRequiredException : FinanceApiException(
    status = AuthenticationErrorCode.TOTP_REQUIRED.status,
    code = AuthenticationErrorCode.TOTP_REQUIRED.code,
    description = AuthenticationErrorCode.TOTP_REQUIRED.description
)
