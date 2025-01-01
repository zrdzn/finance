package dev.zrdzn.finance.backend.vault.application.error

import org.springframework.http.HttpStatus

enum class VaultInvitationErrorCode(val status: Int, val code: String, val description: String) {
    NOT_FOUND(HttpStatus.NOT_FOUND.value(), "VAULT_INVITATION_NOT_FOUND", "Vault invitation not found"),
    NOT_OWNED(HttpStatus.FORBIDDEN.value(), "VAULT_INVITATION_NOT_OWNED", "Vault invitation not owned"),
}
