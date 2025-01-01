package dev.zrdzn.finance.backend.vault.application.error

import dev.zrdzn.finance.backend.error.FinanceApiException

class VaultInvitationNotFoundException : FinanceApiException(
    status = VaultInvitationErrorCode.NOT_FOUND.status,
    code = VaultInvitationErrorCode.NOT_FOUND.code,
    description = VaultInvitationErrorCode.NOT_FOUND.description
)
