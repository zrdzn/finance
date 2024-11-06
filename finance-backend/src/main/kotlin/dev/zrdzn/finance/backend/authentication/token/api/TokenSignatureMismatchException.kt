package dev.zrdzn.finance.backend.authentication.token.api

import dev.zrdzn.finance.backend.api.FinanceApiException

class TokenSignatureMismatchException : FinanceApiException(
    status = TokenErrorCode.SIGNATURE_MISMATCH.status,
    code = TokenErrorCode.SIGNATURE_MISMATCH.code,
    description = TokenErrorCode.SIGNATURE_MISMATCH.description
)
