package dev.zrdzn.finance.backend.vault.api

import dev.zrdzn.finance.backend.vault.VaultId
import dev.zrdzn.finance.backend.vault.VaultPublicId

data class VaultNotFoundException(
    val vaultId: VaultId,
    override val cause: Throwable? = null
) : RuntimeException("Vault with id $vaultId not found", cause)

data class VaultNotFoundByPublicIdException(
    val vaultPublicId: VaultPublicId,
    override val cause: Throwable? = null
) : RuntimeException("Vault with public id $vaultPublicId not found", cause)