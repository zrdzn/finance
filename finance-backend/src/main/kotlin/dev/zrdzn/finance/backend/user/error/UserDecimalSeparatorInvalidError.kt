package dev.zrdzn.finance.backend.user.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class UserDecimalSeparatorInvalidError : FinanceApiError(
    status = UserErrorCode.DECIMAL_SEPARATOR_INVALID.status,
    code = UserErrorCode.DECIMAL_SEPARATOR_INVALID.code,
    description = UserErrorCode.DECIMAL_SEPARATOR_INVALID.description
)
