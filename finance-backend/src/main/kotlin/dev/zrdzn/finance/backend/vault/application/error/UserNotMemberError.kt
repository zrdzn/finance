package dev.zrdzn.finance.backend.vault.application.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class UserNotMemberError : FinanceApiError(
    status = VaultAuthorityErrorCode.NOT_MEMBER.status,
    code = VaultAuthorityErrorCode.NOT_MEMBER.code,
    description = VaultAuthorityErrorCode.NOT_MEMBER.description
)
