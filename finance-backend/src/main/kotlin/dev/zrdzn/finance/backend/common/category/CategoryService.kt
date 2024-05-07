package dev.zrdzn.finance.backend.common.category

import dev.zrdzn.finance.backend.api.category.CategoryCreateResponse
import dev.zrdzn.finance.backend.api.category.CategoryListResponse
import dev.zrdzn.finance.backend.api.category.CategoryResponse
import dev.zrdzn.finance.backend.common.vault.VaultId
import org.slf4j.LoggerFactory

class CategoryService(
    private val categoryRepository: CategoryRepository
) {

    private val logger = LoggerFactory.getLogger(CategoryService::class.java)

    fun createCategory(name: String, vaultId: VaultId): CategoryCreateResponse =
        categoryRepository
            .save(
                Category(
                    id = null,
                    name = name,
                    vaultId = vaultId
                )
            )
            .also { logger.info("Successfully created category: $it") }
            .let {
                CategoryCreateResponse(
                    id = it.id!!
                )
            }

    fun deleteCategoryById(categoryId: CategoryId): Unit =
        categoryRepository.deleteById(categoryId)
            .also { logger.info("Successfully deleted category with id: $categoryId") }

    fun getCategoriesByVaultId(vaultId: VaultId): CategoryListResponse =
        categoryRepository.findAllByVaultId(vaultId)
            .map {
                CategoryResponse(
                    id = it.id!!,
                    name = it.name,
                    vaultId = it.vaultId
                )
            }
            .toSet()
            .let { CategoryListResponse(it) }

}