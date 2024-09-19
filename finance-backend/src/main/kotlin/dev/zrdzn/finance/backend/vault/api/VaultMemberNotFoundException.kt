package dev.zrdzn.finance.backend.vault.api

import dev.zrdzn.finance.backend.vault.VaultMemberId

data class VaultMemberNotFoundException(
    val vaultMemberId: VaultMemberId,
    override val cause: Throwable? = null
) : RuntimeException("Vault member with id $vaultMemberId not found", cause)