package dev.zrdzn.finance.backend.vault.api.authority

import dev.zrdzn.finance.backend.user.UserId
import dev.zrdzn.finance.backend.vault.VaultId
import dev.zrdzn.finance.backend.vault.VaultMemberId

data class VaultCannotUpdateMemberException(
    val vaultId: VaultId,
    val userId: UserId,
    val vaultMemberId: VaultMemberId,
    override val cause: Throwable? = null
) : RuntimeException("User with id $userId tried to update the member with id $vaultMemberId that has higher or equal role", cause)