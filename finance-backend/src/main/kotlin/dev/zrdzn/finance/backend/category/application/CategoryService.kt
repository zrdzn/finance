package dev.zrdzn.finance.backend.category.application

import dev.zrdzn.finance.backend.audit.application.AuditService
import dev.zrdzn.finance.backend.audit.domain.AuditAction
import dev.zrdzn.finance.backend.category.application.CategoryMapper.toResponse
import dev.zrdzn.finance.backend.category.application.error.CategoryNotFoundException
import dev.zrdzn.finance.backend.category.application.response.CategoryListResponse
import dev.zrdzn.finance.backend.category.application.response.CategoryResponse
import dev.zrdzn.finance.backend.category.domain.Category
import dev.zrdzn.finance.backend.category.domain.CategoryRepository
import dev.zrdzn.finance.backend.vault.application.VaultService
import dev.zrdzn.finance.backend.vault.application.VaultPermission
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class CategoryService(
    private val categoryRepository: CategoryRepository,
    private val vaultService: VaultService,
    private val auditService: AuditService
) {

    @Transactional
    fun createCategory(requesterId: Int, name: String, vaultId: Int): CategoryResponse {
        vaultService.authorizeMember(vaultId, requesterId, VaultPermission.CATEGORY_CREATE)

        return categoryRepository
            .save(
                Category(
                    id = null,
                    name = name,
                    vaultId = vaultId
                )
            )
            .also {
                auditService.createAudit(
                    vaultId = vaultId,
                    userId = requesterId,
                    auditAction = AuditAction.CATEGORY_CREATED,
                    description = name
                )
            }
            .toResponse()
    }

    @Transactional
    fun deleteCategory(requesterId: Int, categoryId: Int) {
        val category = getCategoryById(requesterId, categoryId)

        vaultService.authorizeMember(category.vaultId, requesterId, VaultPermission.CATEGORY_DELETE)

        categoryRepository.deleteById(categoryId)

        auditService.createAudit(
            vaultId = category.vaultId,
            userId = requesterId,
            auditAction = AuditAction.CATEGORY_DELETED,
            description = category.name
        )
    }

    @Transactional(readOnly = true)
    fun getCategoryById(requesterId: Int, categoryId: Int): CategoryResponse =
        categoryRepository.findById(categoryId)
            ?.let {
                vaultService.authorizeMember(it.vaultId, requesterId, VaultPermission.CATEGORY_READ)

                it.toResponse()
            }
            ?: throw CategoryNotFoundException()

    @Transactional(readOnly = true)
    fun getCategoriesByVaultId(requesterId: Int, vaultId: Int): CategoryListResponse =
        categoryRepository.findAllByVaultId(vaultId)
            .map {
                vaultService.authorizeMember(vaultId, requesterId, VaultPermission.CATEGORY_READ)

                it.toResponse()
            }
            .toSet()
            .let { CategoryListResponse(it) }

}
