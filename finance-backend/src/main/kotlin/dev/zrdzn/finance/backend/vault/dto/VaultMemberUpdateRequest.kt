package dev.zrdzn.finance.backend.vault.dto

import dev.zrdzn.finance.backend.vault.VaultRole

data class VaultMemberUpdateRequest(
    val vaultRole: VaultRole
)
