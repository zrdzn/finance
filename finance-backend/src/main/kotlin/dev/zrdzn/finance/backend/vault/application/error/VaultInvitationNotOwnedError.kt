package dev.zrdzn.finance.backend.vault.application.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class VaultInvitationNotOwnedError : FinanceApiError(
    status = VaultInvitationErrorCode.NOT_OWNED.status,
    code = VaultInvitationErrorCode.NOT_OWNED.code,
    description = VaultInvitationErrorCode.NOT_OWNED.description
)
