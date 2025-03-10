package dev.zrdzn.finance.backend.authentication.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class AuthenticationAttemptNotFoundError : FinanceApiError(
    status = AuthenticationErrorCode.ATTEMPT_NOT_FOUND.status,
    code = AuthenticationErrorCode.ATTEMPT_NOT_FOUND.code,
    description = AuthenticationErrorCode.ATTEMPT_NOT_FOUND.description
)
