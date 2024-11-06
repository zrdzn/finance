package dev.zrdzn.finance.backend.vault.api.authority

import dev.zrdzn.finance.backend.api.FinanceApiException

class VaultCannotUpdateMemberException : FinanceApiException(
    status = VaultAuthorityErrorCode.CANNOT_UPDATE_MEMBER.status,
    code = VaultAuthorityErrorCode.CANNOT_UPDATE_MEMBER.code,
    description = VaultAuthorityErrorCode.CANNOT_UPDATE_MEMBER.description
)
