package dev.zrdzn.finance.backend.user.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class UserPasswordInvalidError : FinanceApiError(
    status = UserErrorCode.PASSWORD_INVALID.status,
    code = UserErrorCode.PASSWORD_INVALID.code,
    description = UserErrorCode.PASSWORD_INVALID.description
)
