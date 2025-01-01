package dev.zrdzn.finance.backend.vault.application.request

import dev.zrdzn.finance.backend.vault.application.VaultRole

data class VaultMemberUpdateRequest(
    val vaultRole: VaultRole
)
