package dev.zrdzn.finance.backend.category

import dev.zrdzn.finance.backend.category.application.response.CategoryResponse
import dev.zrdzn.finance.backend.category.application.CategoryService
import dev.zrdzn.finance.backend.category.domain.CategoryRepository
import dev.zrdzn.finance.backend.vault.VaultSpecification

open class CategorySpecification : VaultSpecification() {

    protected val categoryService: CategoryService get() = application.getBean(CategoryService::class.java)
    protected val categoryRepository: CategoryRepository get() = application.getBean(CategoryRepository::class.java)

    fun createCategory(
        requesterId: Int,
        vaultId: Int,
        name: String
    ): CategoryResponse =
        categoryService.createCategory(
            requesterId = requesterId,
            name = name,
            vaultId = vaultId
        )

}