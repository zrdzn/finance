package dev.zrdzn.finance.backend.product.api

import dev.zrdzn.finance.backend.category.CategoryId

data class ProductUpdateRequest(
    val categoryId: CategoryId?
)
