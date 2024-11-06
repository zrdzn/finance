package dev.zrdzn.finance.backend.vault.api.invitation

import dev.zrdzn.finance.backend.api.FinanceApiException

class VaultInvitationNotOwnedException : FinanceApiException(
    status = VaultInvitationErrorCode.NOT_OWNED.status,
    code = VaultInvitationErrorCode.NOT_OWNED.code,
    description = VaultInvitationErrorCode.NOT_OWNED.description
)
