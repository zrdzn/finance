package dev.zrdzn.finance.backend.authentication.api

import dev.zrdzn.finance.backend.api.FinanceApiException

class AuthenticationCredentialsInvalidException : FinanceApiException(
    status = AuthenticationErrorCode.INVALID_CREDENTIALS.status,
    code = AuthenticationErrorCode.INVALID_CREDENTIALS.code,
    description = AuthenticationErrorCode.INVALID_CREDENTIALS.description
)
