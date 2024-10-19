package dev.zrdzn.finance.backend.vault.api.member

import dev.zrdzn.finance.backend.vault.api.authority.VaultRole

data class VaultMemberUpdateRequest(
    val vaultRole: VaultRole
)
