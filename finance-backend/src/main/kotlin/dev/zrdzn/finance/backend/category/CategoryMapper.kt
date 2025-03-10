package dev.zrdzn.finance.backend.category

import dev.zrdzn.finance.backend.category.dto.CategoryResponse

object CategoryMapper {

    fun Category.toResponse() = CategoryResponse(
        id = id!!,
        name = name,
        vaultId = vaultId
    )

}