package dev.zrdzn.finance.backend.category.api

import dev.zrdzn.finance.backend.category.CategoryId

data class CategoryNotFoundException(
    val categoryId: CategoryId,
    override val cause: Throwable? = null
) : RuntimeException("Category with id $categoryId not found", cause)
