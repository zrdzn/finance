package dev.zrdzn.finance.backend.category

import dev.zrdzn.finance.backend.category.api.CategoryCreateResponse
import dev.zrdzn.finance.backend.category.api.CategoryListResponse
import dev.zrdzn.finance.backend.category.api.CategoryNotFoundException
import dev.zrdzn.finance.backend.category.api.CategoryResponse
import dev.zrdzn.finance.backend.user.UserId
import dev.zrdzn.finance.backend.vault.VaultId
import dev.zrdzn.finance.backend.vault.VaultService
import dev.zrdzn.finance.backend.vault.api.VaultPermission
import org.slf4j.LoggerFactory

class CategoryService(
    private val categoryRepository: CategoryRepository,
    private val vaultService: VaultService
) {

    private val logger = LoggerFactory.getLogger(CategoryService::class.java)

    fun createCategory(requesterId: UserId, name: String, vaultId: VaultId): CategoryCreateResponse {
        vaultService.authorizeMember(vaultId, requesterId, VaultPermission.CATEGORY_CREATE)

        return categoryRepository
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
    }

    fun deleteCategoryById(requesterId: UserId, categoryId: CategoryId) {
        val category = getCategoryById(requesterId, categoryId)

        vaultService.authorizeMember(category.vaultId, requesterId, VaultPermission.CATEGORY_DELETE)

        categoryRepository.deleteById(categoryId)
            .also { logger.info("Successfully deleted category with id: $categoryId") }
    }

    fun getCategoryById(requesterId: UserId, categoryId: CategoryId): CategoryResponse =
        categoryRepository.findById(categoryId)
            ?.let {
                vaultService.authorizeMember(it.vaultId, requesterId, VaultPermission.CATEGORY_READ)

                CategoryResponse(
                    id = it.id!!,
                    name = it.name,
                    vaultId = it.vaultId
                )
            }
            ?: throw CategoryNotFoundException(categoryId)

    fun getCategoriesByVaultId(requesterId: UserId, vaultId: VaultId): CategoryListResponse =
        categoryRepository.findAllByVaultId(vaultId)
            .map {
                vaultService.authorizeMember(vaultId, requesterId, VaultPermission.CATEGORY_READ)

                CategoryResponse(
                    id = it.id!!,
                    name = it.name,
                    vaultId = it.vaultId
                )
            }
            .toSet()
            .let { CategoryListResponse(it) }

}