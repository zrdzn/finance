package dev.zrdzn.finance.backend.category

import dev.zrdzn.finance.backend.audit.AuditService
import dev.zrdzn.finance.backend.audit.api.AuditAction
import dev.zrdzn.finance.backend.category.api.CategoryListResponse
import dev.zrdzn.finance.backend.category.api.CategoryNotFoundException
import dev.zrdzn.finance.backend.category.api.CategoryResponse
import dev.zrdzn.finance.backend.vault.VaultService
import dev.zrdzn.finance.backend.vault.api.authority.VaultPermission
import org.springframework.transaction.annotation.Transactional

open class CategoryService(
    private val categoryRepository: CategoryRepository,
    private val vaultService: VaultService,
    private val auditService: AuditService
) {

    @Transactional
    open fun createCategory(requesterId: Int, name: String, vaultId: Int): CategoryResponse {
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
    open fun deleteCategory(requesterId: Int, categoryId: Int) {
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
    open fun getCategoryById(requesterId: Int, categoryId: Int): CategoryResponse =
        categoryRepository.findById(categoryId)
            ?.let {
                vaultService.authorizeMember(it.vaultId, requesterId, VaultPermission.CATEGORY_READ)

                it.toResponse()
            }
            ?: throw CategoryNotFoundException()

    @Transactional(readOnly = true)
    open fun getCategoriesByVaultId(requesterId: Int, vaultId: Int): CategoryListResponse =
        categoryRepository.findAllByVaultId(vaultId)
            .map {
                vaultService.authorizeMember(vaultId, requesterId, VaultPermission.CATEGORY_READ)

                it.toResponse()
            }
            .toSet()
            .let { CategoryListResponse(it) }

}
