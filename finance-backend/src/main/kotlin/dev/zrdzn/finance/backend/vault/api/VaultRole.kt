package dev.zrdzn.finance.backend.vault.api

import dev.zrdzn.finance.backend.vault.api.VaultPermission.CATEGORY_CREATE
import dev.zrdzn.finance.backend.vault.api.VaultPermission.CATEGORY_DELETE
import dev.zrdzn.finance.backend.vault.api.VaultPermission.CATEGORY_READ
import dev.zrdzn.finance.backend.vault.api.VaultPermission.CATEGORY_UPDATE
import dev.zrdzn.finance.backend.vault.api.VaultPermission.DETAILS_READ
import dev.zrdzn.finance.backend.vault.api.VaultPermission.MEMBER_INVITE_CREATE
import dev.zrdzn.finance.backend.vault.api.VaultPermission.MEMBER_INVITE_DELETE
import dev.zrdzn.finance.backend.vault.api.VaultPermission.MEMBER_INVITE_READ
import dev.zrdzn.finance.backend.vault.api.VaultPermission.MEMBER_READ
import dev.zrdzn.finance.backend.vault.api.VaultPermission.MEMBER_REMOVE
import dev.zrdzn.finance.backend.vault.api.VaultPermission.PAYMENT_CREATE
import dev.zrdzn.finance.backend.vault.api.VaultPermission.PAYMENT_DELETE
import dev.zrdzn.finance.backend.vault.api.VaultPermission.PAYMENT_READ
import dev.zrdzn.finance.backend.vault.api.VaultPermission.PAYMENT_UPDATE
import dev.zrdzn.finance.backend.vault.api.VaultPermission.PRODUCT_CREATE
import dev.zrdzn.finance.backend.vault.api.VaultPermission.PRODUCT_DELETE
import dev.zrdzn.finance.backend.vault.api.VaultPermission.PRODUCT_READ
import dev.zrdzn.finance.backend.vault.api.VaultPermission.PRODUCT_UPDATE
import dev.zrdzn.finance.backend.vault.api.VaultPermission.SETTINGS_READ
import dev.zrdzn.finance.backend.vault.api.VaultPermission.SETTINGS_UPDATE

private val MEMBER_PERMISSIONS = setOf(
    DETAILS_READ,
    PAYMENT_CREATE, PAYMENT_READ, PAYMENT_UPDATE, PAYMENT_DELETE,
    PRODUCT_CREATE, PRODUCT_READ, PRODUCT_UPDATE, PRODUCT_DELETE,
    CATEGORY_CREATE, CATEGORY_READ, CATEGORY_UPDATE, CATEGORY_DELETE,
    MEMBER_READ,
    MEMBER_INVITE_READ
)

private val MANAGER_PERMISSIONS = MEMBER_PERMISSIONS.union(
    setOf(
        SETTINGS_READ, SETTINGS_UPDATE,
        MEMBER_REMOVE,
        MEMBER_INVITE_CREATE, MEMBER_INVITE_DELETE
    )
)

enum class VaultRole(
    private val permissions: Set<VaultPermission>
) {

    OWNER(VaultPermission.entries.toSet()),
    MANAGER(MANAGER_PERMISSIONS),
    MEMBER(MEMBER_PERMISSIONS);

    fun hasPermission(permission: VaultPermission): Boolean =
        permissions.contains(permission)

    fun getPermissions(): Set<VaultPermission> = permissions

}