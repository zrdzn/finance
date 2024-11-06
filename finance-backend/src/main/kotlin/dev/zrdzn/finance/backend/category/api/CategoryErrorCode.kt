package dev.zrdzn.finance.backend.category.api

import org.springframework.http.HttpStatus

enum class CategoryErrorCode(val status: Int, val code: String, val description: String) {
    NOT_FOUND(HttpStatus.NOT_FOUND.value(), "CATEGORY_NOT_FOUND", "Category not found"),
}
