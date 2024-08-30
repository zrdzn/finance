package dev.zrdzn.finance.backend.shared

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

data class ErrorResponse(
    val status: Int,
    val error: String,
    val message: String?
)

fun Exception.toResponse(status: HttpStatus): ResponseEntity<ErrorResponse> {
    val errorResponse = ErrorResponse(
        status = status.value(),
        error = status.reasonPhrase,
        message = this.message
    )

    return ResponseEntity(errorResponse, status)
}