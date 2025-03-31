package dev.zrdzn.finance.backend.product.error

import dev.zrdzn.finance.backend.product.ProductService.Companion.MAX_NAME_LENGTH
import dev.zrdzn.finance.backend.product.ProductService.Companion.MIN_NAME_LENGTH
import org.springframework.http.HttpStatus

enum class ProductErrorCode(val status: Int, val code: String, val description: String) {
    NOT_FOUND(HttpStatus.NOT_FOUND.value(), "PRODUCT_NOT_FOUND", "Product not found"),
    NAME_INVALID(HttpStatus.BAD_REQUEST.value(), "PRODUCT_NAME_INVALID", "Name must be between $MIN_NAME_LENGTH and $MAX_NAME_LENGTH characters"),
    PRICE_NEGATIVE(HttpStatus.BAD_REQUEST.value(), "PRODUCT_PRICE_NEGATIVE", "Product price cannot be negative"),
}
