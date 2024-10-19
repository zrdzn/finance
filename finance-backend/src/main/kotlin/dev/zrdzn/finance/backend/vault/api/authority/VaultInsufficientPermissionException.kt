package dev.zrdzn.finance.backend.vault.api.authority

import dev.zrdzn.finance.backend.user.UserId
import dev.zrdzn.finance.backend.vault.VaultId

data class VaultInsufficientPermissionException(
    val vaultId: VaultId,
    val userId: UserId,
    val permission: VaultPermission,
    override val cause: Throwable? = null
) : RuntimeException("User with id $userId does not have permission $permission in vault with id $vaultId", cause)