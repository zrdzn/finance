package dev.zrdzn.finance.backend.user.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class UserPasswordTooLongError : FinanceApiError(
    status = UserErrorCode.PASSWORD_TOO_LONG.status,
    code = UserErrorCode.PASSWORD_TOO_LONG.code,
    description = UserErrorCode.PASSWORD_TOO_LONG.description
)
