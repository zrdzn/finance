package dev.zrdzn.finance.backend.vault.application.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class VaultCannotUpdateMemberError : FinanceApiError(
    status = VaultAuthorityErrorCode.CANNOT_UPDATE_MEMBER.status,
    code = VaultAuthorityErrorCode.CANNOT_UPDATE_MEMBER.code,
    description = VaultAuthorityErrorCode.CANNOT_UPDATE_MEMBER.description
)
