package dev.zrdzn.finance.backend.vault.api.authority

enum class VaultPermission {

    DETAILS_READ,
    DELETE,

    AUDIT_READ,

    SETTINGS_READ,
    SETTINGS_UPDATE,

    TRANSACTION_CREATE,
    TRANSACTION_READ,
    TRANSACTION_UPDATE,
    TRANSACTION_DELETE,

    PRODUCT_CREATE,
    PRODUCT_READ,
    PRODUCT_UPDATE,
    PRODUCT_DELETE,

    CATEGORY_CREATE,
    CATEGORY_READ,
    CATEGORY_UPDATE,
    CATEGORY_DELETE,

    MEMBER_READ,
    MEMBER_UPDATE,
    MEMBER_REMOVE,

    MEMBER_INVITE_CREATE,
    MEMBER_INVITE_READ,
    MEMBER_INVITE_DELETE

}