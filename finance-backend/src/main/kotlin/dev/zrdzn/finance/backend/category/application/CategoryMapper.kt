package dev.zrdzn.finance.backend.category.application

import dev.zrdzn.finance.backend.category.application.response.CategoryResponse
import dev.zrdzn.finance.backend.category.domain.Category

object CategoryMapper {

    fun Category.toResponse() = CategoryResponse(
        id = id!!,
        name = name,
        vaultId = vaultId
    )

}