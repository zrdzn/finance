package dev.zrdzn.finance.backend.user.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class UserUsernameTooShortError : FinanceApiError(
    status = UserErrorCode.USERNAME_TOO_SHORT.status,
    code = UserErrorCode.USERNAME_TOO_SHORT.code,
    description = UserErrorCode.USERNAME_TOO_SHORT.description
)
