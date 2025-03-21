package dev.zrdzn.finance.backend.user.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class UserEmailInvalidError : FinanceApiError(
    status = UserErrorCode.EMAIL_INVALID.status,
    code = UserErrorCode.EMAIL_INVALID.code,
    description = UserErrorCode.EMAIL_INVALID.description
)
