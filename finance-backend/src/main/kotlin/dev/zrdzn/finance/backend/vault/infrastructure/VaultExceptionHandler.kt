package dev.zrdzn.finance.backend.vault.infrastructure

import dev.zrdzn.finance.backend.shared.ErrorResponse
import dev.zrdzn.finance.backend.shared.toResponse
import dev.zrdzn.finance.backend.vault.api.authority.UserNotMemberOfVaultException
import dev.zrdzn.finance.backend.vault.api.authority.VaultInsufficientPermissionException
import dev.zrdzn.finance.backend.vault.api.invitation.VaultInvitationNotFoundException
import dev.zrdzn.finance.backend.vault.api.invitation.VaultInvitationNotOwnedException
import dev.zrdzn.finance.backend.vault.api.member.VaultMemberNotFoundException
import dev.zrdzn.finance.backend.vault.api.VaultNotFoundException
import dev.zrdzn.finance.backend.vault.api.authority.VaultCannotUpdateMemberException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class VaultExceptionHandler {

    @ExceptionHandler(VaultInsufficientPermissionException::class)
    fun handleVaultInsufficientPermissionException(
        exception: VaultInsufficientPermissionException
    ): ResponseEntity<ErrorResponse> = exception.toResponse(HttpStatus.FORBIDDEN)

    @ExceptionHandler(VaultNotFoundException::class)
    fun handleVaultNotFoundException(
        exception: VaultNotFoundException
    ): ResponseEntity<ErrorResponse> = exception.toResponse(HttpStatus.NOT_FOUND)

    @ExceptionHandler(VaultInvitationNotFoundException::class)
    fun handleVaultInvitationNotFoundException(
        exception: VaultInvitationNotFoundException
    ): ResponseEntity<ErrorResponse> = exception.toResponse(HttpStatus.NOT_FOUND)

    @ExceptionHandler(VaultInvitationNotOwnedException::class)
    fun handleVaultInvitationNotOwnedException(
        exception: VaultInvitationNotOwnedException
    ): ResponseEntity<ErrorResponse> = exception.toResponse(HttpStatus.FORBIDDEN)

    @ExceptionHandler(VaultMemberNotFoundException::class)
    fun handleVaultMemberNotFoundException(
        exception: VaultMemberNotFoundException
    ): ResponseEntity<ErrorResponse> = exception.toResponse(HttpStatus.NOT_FOUND)

    @ExceptionHandler(UserNotMemberOfVaultException::class)
    fun handleUserNotMemberOfVaultException(
        exception: UserNotMemberOfVaultException
    ): ResponseEntity<ErrorResponse> = exception.toResponse(HttpStatus.FORBIDDEN)

    @ExceptionHandler(VaultCannotUpdateMemberException::class)
    fun handleVaultCannotUpdateMemberException(
        exception: VaultCannotUpdateMemberException
    ): ResponseEntity<ErrorResponse> = exception.toResponse(HttpStatus.FORBIDDEN)

}
