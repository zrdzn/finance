package dev.zrdzn.finance.backend.vault.api

import dev.zrdzn.finance.backend.vault.VaultId

data class VaultNotFoundException(
    val vaultId: VaultId,
    override val cause: Throwable? = null
) : RuntimeException("Vault with id $vaultId not found", cause)
