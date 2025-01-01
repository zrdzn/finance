package dev.zrdzn.finance.backend.product.application.error

import org.springframework.http.HttpStatus

enum class ProductErrorCode(val status: Int, val code: String, val description: String) {
    NOT_FOUND(HttpStatus.NOT_FOUND.value(), "PRODUCT_NOT_FOUND", "Product not found"),
}
