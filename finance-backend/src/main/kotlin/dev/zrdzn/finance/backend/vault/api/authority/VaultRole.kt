package dev.zrdzn.finance.backend.vault.api.authority

import dev.zrdzn.finance.backend.vault.api.authority.VaultPermission.*

private val MEMBER_PERMISSIONS = setOf(
    DETAILS_READ,
    TRANSACTION_CREATE, TRANSACTION_READ, TRANSACTION_UPDATE, TRANSACTION_DELETE,
    PRODUCT_CREATE, PRODUCT_READ, PRODUCT_UPDATE, PRODUCT_DELETE,
    CATEGORY_CREATE, CATEGORY_READ, CATEGORY_UPDATE, CATEGORY_DELETE,
    MEMBER_READ,
    MEMBER_INVITE_READ
)

private val MANAGER_PERMISSIONS = MEMBER_PERMISSIONS.union(
    setOf(
        AUDIT_READ,
        SETTINGS_READ, SETTINGS_UPDATE,
        MEMBER_UPDATE, MEMBER_REMOVE,
        MEMBER_INVITE_CREATE, MEMBER_INVITE_DELETE
    )
)

/**
 * Enum class representing the role of a user in a vault.
 * @property weight the weight of the role (higher weight = higher role)
 */
enum class VaultRole(
    val weight: Int,
    val permissions: Set<VaultPermission>
) {

    OWNER(3, VaultPermission.entries.toSet()),
    MANAGER(2, MANAGER_PERMISSIONS),
    MEMBER(1, MEMBER_PERMISSIONS);

    fun hasPermission(permission: VaultPermission): Boolean =
        permissions.contains(permission)

    fun isHigherThan(role: VaultRole): Boolean = weight > role.weight

    fun isOwner(): Boolean = this == OWNER

}