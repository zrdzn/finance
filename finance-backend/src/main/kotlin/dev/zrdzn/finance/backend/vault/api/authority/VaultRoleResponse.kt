package dev.zrdzn.finance.backend.vault.api.authority

data class VaultRoleResponse(
    val name: String,
    val weight: Int,
    val permissions: Set<VaultPermission>
)