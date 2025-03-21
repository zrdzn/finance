package dev.zrdzn.finance.backend.user.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class UserPasswordTooShortError : FinanceApiError(
    status = UserErrorCode.PASSWORD_TOO_SHORT.status,
    code = UserErrorCode.PASSWORD_TOO_SHORT.code,
    description = UserErrorCode.PASSWORD_TOO_SHORT.description
)
