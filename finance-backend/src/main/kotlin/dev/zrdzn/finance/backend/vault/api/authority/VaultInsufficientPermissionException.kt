package dev.zrdzn.finance.backend.vault.api.authority

import dev.zrdzn.finance.backend.api.FinanceApiException

class VaultInsufficientPermissionException : FinanceApiException(
    status = VaultAuthorityErrorCode.INSUFFICIENT_PERMISSIONS.status,
    code = VaultAuthorityErrorCode.INSUFFICIENT_PERMISSIONS.code,
    description = VaultAuthorityErrorCode.INSUFFICIENT_PERMISSIONS.description
)
