package dev.zrdzn.finance.backend.vault.error

import org.springframework.http.HttpStatus

enum class VaultAuthorityErrorCode(val status: Int, val code: String, val description: String) {
    CANNOT_UPDATE_MEMBER(HttpStatus.FORBIDDEN.value(), "VAULT_AUTHORITY_CANNOT_UPDATE_MEMBER", "Cannot update member"),
    CANNOT_DELETE_MEMBER(HttpStatus.FORBIDDEN.value(), "VAULT_AUTHORITY_CANNOT_DELETE_MEMBER", "Cannot delete member from vault"),
    NOT_MEMBER(HttpStatus.FORBIDDEN.value(), "VAULT_AUTHORITY_NOT_MEMBER", "Not a member"),
    INSUFFICIENT_PERMISSIONS(HttpStatus.FORBIDDEN.value(), "VAULT_AUTHORITY_INSUFFICIENT_PERMISSIONS", "Insufficient permissions"),
}
