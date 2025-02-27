package dev.zrdzn.finance.backend.token.application.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class TokenSignatureMismatchError : FinanceApiError(
    status = TokenErrorCode.SIGNATURE_MISMATCH.status,
    code = TokenErrorCode.SIGNATURE_MISMATCH.code,
    description = TokenErrorCode.SIGNATURE_MISMATCH.description
)
