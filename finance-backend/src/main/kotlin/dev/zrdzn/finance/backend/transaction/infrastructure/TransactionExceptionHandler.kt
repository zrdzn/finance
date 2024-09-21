package dev.zrdzn.finance.backend.transaction.infrastructure

import dev.zrdzn.finance.backend.shared.ErrorResponse
import dev.zrdzn.finance.backend.shared.toResponse
import dev.zrdzn.finance.backend.transaction.api.TransactionNotFoundException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class TransactionExceptionHandler {

    @ExceptionHandler(TransactionNotFoundException::class)
    fun handleTransactionNotFoundException(
        exception: TransactionNotFoundException
    ): ResponseEntity<ErrorResponse> = exception.toResponse(HttpStatus.NOT_FOUND)

}
