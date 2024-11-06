package dev.zrdzn.finance.backend.vault.api.member

import dev.zrdzn.finance.backend.api.FinanceApiException

class VaultMemberNotFoundException : FinanceApiException(
    status = VaultMemberErrorCode.NOT_FOUND.status,
    code = VaultMemberErrorCode.NOT_FOUND.code,
    description = VaultMemberErrorCode.NOT_FOUND.description
)
