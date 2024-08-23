package dev.zrdzn.finance.backend.vault.api

data class VaultPermissionListResponse(
    val vaultPermissions: Set<VaultPermission>
)
