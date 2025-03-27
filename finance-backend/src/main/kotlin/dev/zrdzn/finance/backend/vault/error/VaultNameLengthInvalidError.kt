package dev.zrdzn.finance.backend.vault.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class VaultNameLengthInvalidError : FinanceApiError(
    status = VaultErrorCode.NAME_LENGTH_INVALID.status,
    code = VaultErrorCode.NAME_LENGTH_INVALID.code,
    description = VaultErrorCode.NAME_LENGTH_INVALID.description
)
