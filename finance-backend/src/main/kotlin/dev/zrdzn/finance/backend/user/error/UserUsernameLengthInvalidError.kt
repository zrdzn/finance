package dev.zrdzn.finance.backend.user.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class UserUsernameLengthInvalidError : FinanceApiError(
    status = UserErrorCode.USERNAME_LENGTH_INVALID.status,
    code = UserErrorCode.USERNAME_LENGTH_INVALID.code,
    description = UserErrorCode.USERNAME_LENGTH_INVALID.description
)
