package dev.zrdzn.finance.backend.authentication.infrastructure

import dev.zrdzn.finance.backend.authentication.api.AuthenticationCredentialsInvalidException
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

}
