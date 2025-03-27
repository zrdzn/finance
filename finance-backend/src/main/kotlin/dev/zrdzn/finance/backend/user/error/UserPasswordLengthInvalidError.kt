package dev.zrdzn.finance.backend.user.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class UserPasswordLengthInvalidError : FinanceApiError(
    status = UserErrorCode.PASSWORD_LENGTH_INVALID.status,
    code = UserErrorCode.PASSWORD_LENGTH_INVALID.code,
    description = UserErrorCode.PASSWORD_LENGTH_INVALID.description
)
