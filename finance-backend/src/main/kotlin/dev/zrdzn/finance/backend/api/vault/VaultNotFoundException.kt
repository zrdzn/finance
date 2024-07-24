package dev.zrdzn.finance.backend.api.vault

import dev.zrdzn.finance.backend.common.vault.VaultId

data class VaultNotFoundException(
    val vaultId: VaultId,
    override val cause: Throwable? = null
) : RuntimeException("Vault with id $vaultId not found", cause)
