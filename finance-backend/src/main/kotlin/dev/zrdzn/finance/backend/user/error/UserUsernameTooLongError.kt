package dev.zrdzn.finance.backend.user.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class UserUsernameTooLongError : FinanceApiError(
    status = UserErrorCode.USERNAME_TOO_LONG.status,
    code = UserErrorCode.USERNAME_TOO_LONG.code,
    description = UserErrorCode.USERNAME_TOO_LONG.description
)
