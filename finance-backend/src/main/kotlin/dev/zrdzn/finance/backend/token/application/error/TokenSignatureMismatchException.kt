package dev.zrdzn.finance.backend.token.application.error

import dev.zrdzn.finance.backend.error.FinanceApiException

class TokenSignatureMismatchException : FinanceApiException(
    status = TokenErrorCode.SIGNATURE_MISMATCH.status,
    code = TokenErrorCode.SIGNATURE_MISMATCH.code,
    description = TokenErrorCode.SIGNATURE_MISMATCH.description
)
