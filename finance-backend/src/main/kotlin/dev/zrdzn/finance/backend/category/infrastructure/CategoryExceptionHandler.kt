package dev.zrdzn.finance.backend.category.infrastructure

import dev.zrdzn.finance.backend.category.api.CategoryNotFoundException
import dev.zrdzn.finance.backend.shared.ErrorResponse
import dev.zrdzn.finance.backend.shared.toResponse
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class CategoryExceptionHandler {

    @ExceptionHandler(CategoryNotFoundException::class)
    fun handleCategoryNotFoundException(
        exception: CategoryNotFoundException
    ): ResponseEntity<ErrorResponse> = exception.toResponse(HttpStatus.NOT_FOUND)

}
