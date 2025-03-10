package dev.zrdzn.finance.backend.product

import dev.zrdzn.finance.backend.product.dto.ProductResponse

object ProductMapper {

    fun Product.toResponse(categoryName: String?) = ProductResponse(
        id = id!!,
        name = name,
        vaultId = vaultId,
        categoryId = categoryId,
        categoryName = categoryName
    )

}