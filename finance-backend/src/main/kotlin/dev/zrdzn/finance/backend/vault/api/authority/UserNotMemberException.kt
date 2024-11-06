package dev.zrdzn.finance.backend.vault.api.authority

import dev.zrdzn.finance.backend.api.FinanceApiException

class UserNotMemberException : FinanceApiException(
    status = VaultAuthorityErrorCode.NOT_MEMBER.status,
    code = VaultAuthorityErrorCode.NOT_MEMBER.code,
    description = VaultAuthorityErrorCode.NOT_MEMBER.description
)
