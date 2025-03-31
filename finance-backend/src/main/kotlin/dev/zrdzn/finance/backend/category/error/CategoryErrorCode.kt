package dev.zrdzn.finance.backend.category.error

import dev.zrdzn.finance.backend.category.CategoryService.Companion.MAX_NAME_LENGTH
import dev.zrdzn.finance.backend.category.CategoryService.Companion.MIN_NAME_LENGTH
import org.springframework.http.HttpStatus

enum class CategoryErrorCode(val status: Int, val code: String, val description: String) {
    NOT_FOUND(HttpStatus.NOT_FOUND.value(), "CATEGORY_NOT_FOUND", "Category not found"),
    NAME_INVALID(HttpStatus.BAD_REQUEST.value(), "CATEGORY_NAME_INVALID", "Name must be between $MIN_NAME_LENGTH and $MAX_NAME_LENGTH characters"),
}
