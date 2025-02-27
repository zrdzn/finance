package dev.zrdzn.finance.backend.error

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class FinanceApiErrorHandler {

    @ExceptionHandler(FinanceApiError::class)
    fun handleApiError(
        error: FinanceApiError
    ): ResponseEntity<FinanceApiErrorResponse> {
        val errorResponse = FinanceApiErrorResponse(
            status = error.status,
            code = error.code,
            description = error.description
        )

        return ResponseEntity.status(errorResponse.status).body(errorResponse)
    }

}
