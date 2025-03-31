package dev.zrdzn.finance.backend.user.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class UserUsernameInvalidError : FinanceApiError(
    status = UserErrorCode.USERNAME_INVALID.status,
    code = UserErrorCode.USERNAME_INVALID.code,
    description = UserErrorCode.USERNAME_INVALID.description
)
