package dev.zrdzn.finance.backend.user.application.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class UserEmailAlreadyTakenError : FinanceApiError(
    status = UserErrorCode.EMAIL_ALREADY_TAKEN.status,
    code = UserErrorCode.EMAIL_ALREADY_TAKEN.code,
    description = UserErrorCode.EMAIL_ALREADY_TAKEN.description
)
