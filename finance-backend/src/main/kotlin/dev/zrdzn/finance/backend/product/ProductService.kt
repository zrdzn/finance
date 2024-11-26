package dev.zrdzn.finance.backend.product

import dev.zrdzn.finance.backend.audit.AuditService
import dev.zrdzn.finance.backend.audit.api.AuditAction
import dev.zrdzn.finance.backend.category.CategoryService
import dev.zrdzn.finance.backend.product.api.ProductListResponse
import dev.zrdzn.finance.backend.product.api.ProductNotFoundException
import dev.zrdzn.finance.backend.product.api.ProductResponse
import dev.zrdzn.finance.backend.vault.VaultService
import dev.zrdzn.finance.backend.vault.api.authority.VaultPermission
import org.springframework.transaction.annotation.Transactional

open class ProductService(
    private val productRepository: ProductRepository,
    private val categoryService: CategoryService,
    private val vaultService: VaultService,
    private val auditService: AuditService
) {

    @Transactional
    open fun createProduct(requesterId: Int, name: String, vaultId: Int, categoryId: Int?): ProductResponse {
        vaultService.authorizeMember(vaultId, requesterId, VaultPermission.PRODUCT_CREATE)

        return productRepository
            .save(
                Product(
                    id = null,
                    name = name,
                    vaultId = vaultId,
                    categoryId = categoryId
                )
            )
            .also {
                auditService.createAudit(
                    vaultId = vaultId,
                    userId = requesterId,
                    auditAction = AuditAction.PRODUCT_CREATED,
                    description = name
                )
            }
            .toResponse(if (categoryId != null) categoryService.getCategoryById(requesterId, categoryId).name else null)
    }

    @Transactional
    open fun updateProduct(requesterId: Int, productId: Int, categoryId: Int?) {
        val product = productRepository.findById(productId) ?: throw ProductNotFoundException()

        vaultService.authorizeMember(product.vaultId, requesterId, VaultPermission.PRODUCT_UPDATE)

        product.categoryId = categoryId

        auditService.createAudit(
            vaultId = product.vaultId,
            userId = requesterId,
            auditAction = AuditAction.PRODUCT_UPDATED,
            description = product.name
        )
    }

    @Transactional
    open fun deleteProduct(requesterId: Int, productId: Int) {
        val product = productRepository.findById(productId) ?: throw ProductNotFoundException()

        vaultService.authorizeMember(product.vaultId, requesterId, VaultPermission.PRODUCT_DELETE)

        productRepository.deleteById(productId)

        auditService.createAudit(
            vaultId = product.vaultId,
            userId = requesterId,
            auditAction = AuditAction.PRODUCT_DELETED,
            description = product.name
        )
    }

    @Transactional(readOnly = true)
    open fun getProducts(requesterId: Int, vaultId: Int): ProductListResponse =
        productRepository
            .findByVaultId(vaultId)
            .map { it.toResponse(it.categoryId?.let { id -> categoryService.getCategoryById(requesterId, id) }?.name) }
            .toSet()
            .let { ProductListResponse(it) }

    @Transactional(readOnly = true)
    open fun getProduct(requesterId: Int, productId: Int): ProductResponse =
        productRepository
            .findById(productId)
            ?.let {
                vaultService.authorizeMember(it.vaultId, requesterId, VaultPermission.PRODUCT_READ)

                it.toResponse(it.categoryId?.let { id -> categoryService.getCategoryById(requesterId, id) }?.name)
            }
            ?: throw ProductNotFoundException()

}
