package dev.zrdzn.finance.backend.user.infrastructure

import dev.zrdzn.finance.backend.shared.ErrorResponse
import dev.zrdzn.finance.backend.shared.toResponse
import dev.zrdzn.finance.backend.user.api.security.UserAccessDeniedException
import dev.zrdzn.finance.backend.user.api.UserEmailAlreadyTakenException
import dev.zrdzn.finance.backend.user.api.UserNotFoundByEmailException
import dev.zrdzn.finance.backend.user.api.UserNotFoundException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class UserExceptionHandler {

    @ExceptionHandler(UserNotFoundException::class)
    fun handleUserNotFoundException(
        exception: UserNotFoundException
    ): ResponseEntity<ErrorResponse> = exception.toResponse(HttpStatus.NOT_FOUND)

    @ExceptionHandler(UserNotFoundByEmailException::class)
    fun handleUserNotFoundByEmailException(
        exception: UserNotFoundByEmailException
    ): ResponseEntity<ErrorResponse> = exception.toResponse(HttpStatus.NOT_FOUND)

    @ExceptionHandler(UserAccessDeniedException::class)
    fun handleUserAccessDeniedException(
        exception: UserAccessDeniedException
    ): ResponseEntity<ErrorResponse> = exception.toResponse(HttpStatus.FORBIDDEN)

    @ExceptionHandler(UserEmailAlreadyTakenException::class)
    fun handleUserEmailAlreadyTakenException(
        exception: UserEmailAlreadyTakenException
    ): ResponseEntity<ErrorResponse> = exception.toResponse(HttpStatus.CONFLICT)

}
