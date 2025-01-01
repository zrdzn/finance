package dev.zrdzn.finance.backend.product.application

import dev.zrdzn.finance.backend.product.application.response.ProductResponse
import dev.zrdzn.finance.backend.product.domain.Product

object ProductMapper {

    fun Product.toResponse(categoryName: String?) = ProductResponse(
        id = id!!,
        name = name,
        vaultId = vaultId,
        categoryId = categoryId,
        categoryName = categoryName
    )

}