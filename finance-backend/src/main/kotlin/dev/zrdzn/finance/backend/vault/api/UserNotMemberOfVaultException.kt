package dev.zrdzn.finance.backend.vault.api

import dev.zrdzn.finance.backend.user.UserId
import dev.zrdzn.finance.backend.vault.VaultId

data class UserNotMemberOfVaultException(
    val vaultId: VaultId,
    val userId: UserId,
    override val cause: Throwable? = null
) : RuntimeException("User with id $userId is not a member of vault with id $vaultId", cause)