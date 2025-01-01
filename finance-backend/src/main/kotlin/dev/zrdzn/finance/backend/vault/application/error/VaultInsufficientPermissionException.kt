package dev.zrdzn.finance.backend.vault.application.error

import dev.zrdzn.finance.backend.error.FinanceApiException

class VaultInsufficientPermissionException : FinanceApiException(
    status = VaultAuthorityErrorCode.INSUFFICIENT_PERMISSIONS.status,
    code = VaultAuthorityErrorCode.INSUFFICIENT_PERMISSIONS.code,
    description = VaultAuthorityErrorCode.INSUFFICIENT_PERMISSIONS.description
)
