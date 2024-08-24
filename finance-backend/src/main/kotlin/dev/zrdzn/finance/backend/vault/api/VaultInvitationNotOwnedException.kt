package dev.zrdzn.finance.backend.vault.api

import dev.zrdzn.finance.backend.user.UserId

data class VaultInvitationNotOwnedException(
    val userId: UserId,
    override val cause: Throwable? = null
) : RuntimeException("User with id $userId tried to access invitation which was meant for someone else", cause)
