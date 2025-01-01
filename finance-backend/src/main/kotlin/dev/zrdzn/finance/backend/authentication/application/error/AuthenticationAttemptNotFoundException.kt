package dev.zrdzn.finance.backend.authentication.application.error

import dev.zrdzn.finance.backend.error.FinanceApiException

class AuthenticationAttemptNotFoundException : FinanceApiException(
    status = AuthenticationErrorCode.ATTEMPT_NOT_FOUND.status,
    code = AuthenticationErrorCode.ATTEMPT_NOT_FOUND.code,
    description = AuthenticationErrorCode.ATTEMPT_NOT_FOUND.description
)
