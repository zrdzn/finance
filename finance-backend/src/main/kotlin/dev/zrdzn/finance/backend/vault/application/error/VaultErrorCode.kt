package dev.zrdzn.finance.backend.vault.application.error

import org.springframework.http.HttpStatus

enum class VaultErrorCode(val status: Int, val code: String, val description: String) {
    NOT_FOUND(HttpStatus.NOT_FOUND.value(), "VAULT_NOT_FOUND", "Vault not found"),
    NOT_FOUND_BY_PUBLIC_ID(HttpStatus.NOT_FOUND.value(), "VAULT_NOT_FOUND_BY_PUBLIC_ID", "Vault not found by public id")
}
