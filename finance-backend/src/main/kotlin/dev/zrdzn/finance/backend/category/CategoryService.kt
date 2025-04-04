package dev.zrdzn.finance.backend.category

import dev.zrdzn.finance.backend.audit.AuditAction
import dev.zrdzn.finance.backend.audit.AuditService
import dev.zrdzn.finance.backend.category.CategoryMapper.toResponse
import dev.zrdzn.finance.backend.category.dto.CategoryListResponse
import dev.zrdzn.finance.backend.category.dto.CategoryResponse
import dev.zrdzn.finance.backend.category.error.CategoryNotFoundError
import dev.zrdzn.finance.backend.vault.VaultPermission
import dev.zrdzn.finance.backend.vault.VaultService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class CategoryService(
    private val categoryRepository: CategoryRepository,
    private val vaultService: VaultService,
    private val auditService: AuditService
) {

    @Transactional
    fun createCategory(requesterId: Int, name: String, vaultId: Int): CategoryResponse =
        vaultService.withAuthorization(vaultId, requesterId, VaultPermission.CATEGORY_CREATE) {
            categoryRepository
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

        return vaultService.withAuthorization(category.vaultId, requesterId, VaultPermission.CATEGORY_DELETE) {
            categoryRepository.deleteById(categoryId)

            auditService.createAudit(
                vaultId = category.vaultId,
                userId = requesterId,
                auditAction = AuditAction.CATEGORY_DELETED,
                description = category.name
            )
        }
    }

    @Transactional(readOnly = true)
    fun getCategoryById(requesterId: Int, categoryId: Int): CategoryResponse =
        categoryRepository.findById(categoryId)
            ?.let {
                vaultService.withAuthorization(it.vaultId, requesterId, VaultPermission.CATEGORY_READ) { _ ->
                    it.toResponse()
                }
            }
            ?: throw CategoryNotFoundError()

    @Transactional(readOnly = true)
    fun getCategoriesByVaultId(requesterId: Int, vaultId: Int): CategoryListResponse =
        categoryRepository.findAllByVaultId(vaultId)
            .map {
                vaultService.withAuthorization(vaultId, requesterId, VaultPermission.CATEGORY_READ) { _ ->
                    it.toResponse()
                }
            }
            .toSet()
            .let { CategoryListResponse(it) }

}
