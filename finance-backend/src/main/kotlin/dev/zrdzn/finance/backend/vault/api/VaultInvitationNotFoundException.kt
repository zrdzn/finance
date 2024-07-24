package dev.zrdzn.finance.backend.vault.api

import dev.zrdzn.finance.backend.vault.VaultInvitationId

data class VaultInvitationNotFoundException(
    val vaultInvitationId: VaultInvitationId,
    override val cause: Throwable? = null
) : RuntimeException("Vault invitation with id $vaultInvitationId not found", cause)
