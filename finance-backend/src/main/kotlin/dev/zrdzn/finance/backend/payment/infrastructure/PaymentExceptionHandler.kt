package dev.zrdzn.finance.backend.payment.infrastructure

import dev.zrdzn.finance.backend.payment.api.ProductNotFoundException
import dev.zrdzn.finance.backend.shared.ErrorResponse
import dev.zrdzn.finance.backend.shared.toResponse
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class PaymentExceptionHandler {

    @ExceptionHandler(ProductNotFoundException::class)
    fun handlePaymentNotFoundException(
        exception: ProductNotFoundException
    ): ResponseEntity<ErrorResponse> = exception.toResponse(HttpStatus.NOT_FOUND)

}
