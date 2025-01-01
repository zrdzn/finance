package dev.zrdzn.finance.backend.vault.application.response

import dev.zrdzn.finance.backend.vault.application.VaultPermission

data class VaultRoleResponse(
    val name: String,
    val weight: Int,
    val permissions: Set<VaultPermission>
)