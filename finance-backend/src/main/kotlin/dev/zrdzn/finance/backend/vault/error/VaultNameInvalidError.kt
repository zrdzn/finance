package dev.zrdzn.finance.backend.vault.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class VaultNameInvalidError : FinanceApiError(
    status = VaultErrorCode.NAME_INVALID.status,
    code = VaultErrorCode.NAME_INVALID.code,
    description = VaultErrorCode.NAME_INVALID.description
)
