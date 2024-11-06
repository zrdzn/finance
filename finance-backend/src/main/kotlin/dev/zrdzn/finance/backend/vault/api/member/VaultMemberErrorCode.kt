package dev.zrdzn.finance.backend.vault.api.member

import org.springframework.http.HttpStatus

enum class VaultMemberErrorCode(val status: Int, val code: String, val description: String) {
    NOT_FOUND(HttpStatus.NOT_FOUND.value(), "VAULT_MEMBER_NOT_FOUND", "Vault member not found"),
}
