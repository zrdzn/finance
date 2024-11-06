package dev.zrdzn.finance.backend.vault.api.invitation

import dev.zrdzn.finance.backend.api.FinanceApiException

class VaultInvitationNotFoundException : FinanceApiException(
    status = VaultInvitationErrorCode.NOT_FOUND.status,
    code = VaultInvitationErrorCode.NOT_FOUND.code,
    description = VaultInvitationErrorCode.NOT_FOUND.description
)
