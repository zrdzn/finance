package dev.zrdzn.finance.backend.user.api

import dev.zrdzn.finance.backend.api.FinanceApiException

class UserEmailAlreadyTakenException : FinanceApiException(
    status = UserErrorCode.EMAIL_ALREADY_TAKEN.status,
    code = UserErrorCode.EMAIL_ALREADY_TAKEN.code,
    description = UserErrorCode.EMAIL_ALREADY_TAKEN.description
)
