package dev.zrdzn.finance.backend.vault.application.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class VaultMemberNotFoundError : FinanceApiError(
    status = VaultMemberErrorCode.NOT_FOUND.status,
    code = VaultMemberErrorCode.NOT_FOUND.code,
    description = VaultMemberErrorCode.NOT_FOUND.description
)
