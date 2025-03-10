package dev.zrdzn.finance.backend.vault.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class VaultInsufficientPermissionError : FinanceApiError(
    status = VaultAuthorityErrorCode.INSUFFICIENT_PERMISSIONS.status,
    code = VaultAuthorityErrorCode.INSUFFICIENT_PERMISSIONS.code,
    description = VaultAuthorityErrorCode.INSUFFICIENT_PERMISSIONS.description
)
