package dev.zrdzn.finance.backend.error

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class FinanceApiExceptionHandler {

    @ExceptionHandler(FinanceApiException::class)
    fun handleApiException(
        exception: FinanceApiException
    ): ResponseEntity<FinanceApiExceptionResponse> {
        val errorResponse = FinanceApiExceptionResponse(
            status = exception.status,
            code = exception.code,
            description = exception.description
        )

        return ResponseEntity.status(errorResponse.status).body(errorResponse)
    }

}
