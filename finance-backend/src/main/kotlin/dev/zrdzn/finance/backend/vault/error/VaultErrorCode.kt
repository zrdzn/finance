package dev.zrdzn.finance.backend.vault.error

import dev.zrdzn.finance.backend.vault.VaultService.Companion.MAX_NAME_LENGTH
import dev.zrdzn.finance.backend.vault.VaultService.Companion.MIN_NAME_LENGTH
import org.springframework.http.HttpStatus

enum class VaultErrorCode(val status: Int, val code: String, val description: String) {
    NOT_FOUND(HttpStatus.NOT_FOUND.value(), "VAULT_NOT_FOUND", "Vault not found"),
    NOT_FOUND_BY_PUBLIC_ID(HttpStatus.NOT_FOUND.value(), "VAULT_NOT_FOUND_BY_PUBLIC_ID", "Vault not found by public id"),
    NAME_INVALID(HttpStatus.BAD_REQUEST.value(), "VAULT_NAME_INVALID", "Vault name must be between $MIN_NAME_LENGTH and $MAX_NAME_LENGTH characters long"),
    CURRENCY_INVALID(HttpStatus.BAD_REQUEST.value(), "VAULT_CURRENCY_INVALID", "Provided currency is invalid"),
}
