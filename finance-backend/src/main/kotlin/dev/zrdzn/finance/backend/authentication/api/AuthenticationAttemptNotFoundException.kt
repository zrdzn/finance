package dev.zrdzn.finance.backend.authentication.api

import dev.zrdzn.finance.backend.api.FinanceApiException

class AuthenticationAttemptNotFoundException : FinanceApiException(
    status = AuthenticationErrorCode.ATTEMPT_NOT_FOUND.status,
    code = AuthenticationErrorCode.ATTEMPT_NOT_FOUND.code,
    description = AuthenticationErrorCode.ATTEMPT_NOT_FOUND.description
)
