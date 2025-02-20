package dev.zrdzn.finance.backend.authentication.application.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class AuthenticationCredentialsInvalidError : FinanceApiError(
    status = AuthenticationErrorCode.INVALID_CREDENTIALS.status,
    code = AuthenticationErrorCode.INVALID_CREDENTIALS.code,
    description = AuthenticationErrorCode.INVALID_CREDENTIALS.description
)
