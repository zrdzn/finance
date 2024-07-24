package dev.zrdzn.finance.backend.api.vault

import dev.zrdzn.finance.backend.common.vault.VaultInvitationId

data class VaultInvitationNotFoundException(
    val vaultInvitationId: VaultInvitationId,
    override val cause: Throwable? = null
) : RuntimeException("Vault invitation with id $vaultInvitationId not found", cause)
