package dev.zrdzn.finance.backend.vault.dto

import dev.zrdzn.finance.backend.vault.VaultPermission

data class VaultRoleResponse(
    val name: String,
    val weight: Int,
    val permissions: Set<VaultPermission>
)