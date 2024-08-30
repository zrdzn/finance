package dev.zrdzn.finance.backend.authentication.token.infrastructure

import dev.zrdzn.finance.backend.authentication.token.api.TokenSignatureMismatchException
import dev.zrdzn.finance.backend.shared.ErrorResponse
import dev.zrdzn.finance.backend.shared.toResponse
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class TokenExceptionHandler {

    @ExceptionHandler(TokenSignatureMismatchException::class)
    fun handleTokenSignatureMismatchException(
        exception: TokenSignatureMismatchException
    ): ResponseEntity<ErrorResponse> = exception.toResponse(HttpStatus.UNAUTHORIZED)

}
