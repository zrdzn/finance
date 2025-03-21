package dev.zrdzn.finance.backend.vault.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class VaultCannotDeleteMemberError : FinanceApiError(
    status = VaultAuthorityErrorCode.CANNOT_DELETE_MEMBER.status,
    code = VaultAuthorityErrorCode.CANNOT_DELETE_MEMBER.code,
    description = VaultAuthorityErrorCode.CANNOT_DELETE_MEMBER.description
)
