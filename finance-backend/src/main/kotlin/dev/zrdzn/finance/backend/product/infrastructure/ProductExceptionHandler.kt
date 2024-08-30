package dev.zrdzn.finance.backend.product.infrastructure

import dev.zrdzn.finance.backend.product.api.ProductNotFoundException
import dev.zrdzn.finance.backend.shared.ErrorResponse
import dev.zrdzn.finance.backend.shared.toResponse
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class ProductExceptionHandler {

    @ExceptionHandler(ProductNotFoundException::class)
    fun handleProductNotFoundException(
        exception: ProductNotFoundException
    ): ResponseEntity<ErrorResponse> = exception.toResponse(HttpStatus.NOT_FOUND)

}
