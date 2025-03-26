package dev.zrdzn.finance.backend.user.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class UserGroupSeparatorInvalidError : FinanceApiError(
    status = UserErrorCode.GROUP_SEPARATOR_INVALID.status,
    code = UserErrorCode.GROUP_SEPARATOR_INVALID.code,
    description = UserErrorCode.GROUP_SEPARATOR_INVALID.description
)
