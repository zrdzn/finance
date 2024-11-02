package dev.zrdzn.finance.backend.authentication.infrastructure

import dev.zrdzn.finance.backend.authentication.api.AuthenticationAttemptNotFoundException
import dev.zrdzn.finance.backend.authentication.api.AuthenticationCredentialsInvalidException
import dev.zrdzn.finance.backend.authentication.api.AuthenticationTotpInvalidException
import dev.zrdzn.finance.backend.authentication.api.AuthenticationTotpRequiredException
import dev.zrdzn.finance.backend.shared.ErrorResponse
import dev.zrdzn.finance.backend.shared.toResponse
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class AuthenticationExceptionHandler {

    @ExceptionHandler(AuthenticationCredentialsInvalidException::class)
    fun handleAuthenticationCredentialsInvalidException(
        exception: AuthenticationCredentialsInvalidException
    ): ResponseEntity<ErrorResponse> = exception.toResponse(HttpStatus.UNAUTHORIZED)

    @ExceptionHandler(AuthenticationAttemptNotFoundException::class)
    fun handleAuthenticationAttemptNotFoundException(
        exception: AuthenticationAttemptNotFoundException
    ): ResponseEntity<ErrorResponse> = exception.toResponse(HttpStatus.NOT_FOUND)

    @ExceptionHandler(AuthenticationTotpRequiredException::class)
    fun handleAuthenticationTotpRequiredException(
        exception: AuthenticationTotpRequiredException
    ): ResponseEntity<ErrorResponse> = exception.toResponse(HttpStatus.UNAUTHORIZED)

    @ExceptionHandler(AuthenticationTotpInvalidException::class)
    fun handleAuthenticationTotpInvalidException(
        exception: AuthenticationTotpInvalidException
    ): ResponseEntity<ErrorResponse> = exception.toResponse(HttpStatus.UNAUTHORIZED)

}
