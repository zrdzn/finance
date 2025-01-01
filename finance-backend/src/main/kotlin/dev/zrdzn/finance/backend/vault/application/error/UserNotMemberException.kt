package dev.zrdzn.finance.backend.vault.application.error

import dev.zrdzn.finance.backend.error.FinanceApiException

class UserNotMemberException : FinanceApiException(
    status = VaultAuthorityErrorCode.NOT_MEMBER.status,
    code = VaultAuthorityErrorCode.NOT_MEMBER.code,
    description = VaultAuthorityErrorCode.NOT_MEMBER.description
)
