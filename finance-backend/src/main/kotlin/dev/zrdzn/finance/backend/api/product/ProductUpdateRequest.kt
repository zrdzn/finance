package dev.zrdzn.finance.backend.api.product

import dev.zrdzn.finance.backend.common.category.CategoryId

data class ProductUpdateRequest(
    val categoryId: CategoryId?
)
