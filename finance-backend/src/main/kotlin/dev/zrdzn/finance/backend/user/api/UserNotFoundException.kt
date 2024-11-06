package dev.zrdzn.finance.backend.user.api

import dev.zrdzn.finance.backend.api.FinanceApiException

class UserNotFoundException : FinanceApiException(
    status = UserErrorCode.NOT_FOUND.status,
    code = UserErrorCode.NOT_FOUND.code,
    description = UserErrorCode.NOT_FOUND.description,
)

class UserNotFoundByEmailException : FinanceApiException(
    status = UserErrorCode.NOT_FOUND_BY_EMAIL.status,
    code = UserErrorCode.NOT_FOUND_BY_EMAIL.code,
    description = UserErrorCode.NOT_FOUND_BY_EMAIL.description
)
