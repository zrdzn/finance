package dev.zrdzn.finance.backend.product

import dev.zrdzn.finance.backend.category.dto.CategoryResponse
import dev.zrdzn.finance.backend.product.dto.ProductResponse

object ProductMapper {

    fun Product.toResponse(category: CategoryResponse?) = ProductResponse(
        id = id!!,
        name = name,
        vaultId = vaultId,
        category = category,
        unitAmount = unitAmount
    )

}