package dev.zrdzn.finance.backend.product

import dev.zrdzn.finance.backend.audit.AuditService
import dev.zrdzn.finance.backend.audit.AuditAction
import dev.zrdzn.finance.backend.category.CategoryService
import dev.zrdzn.finance.backend.product.ProductMapper.toResponse
import dev.zrdzn.finance.backend.product.error.ProductNotFoundError
import dev.zrdzn.finance.backend.product.dto.ProductListResponse
import dev.zrdzn.finance.backend.product.dto.ProductResponse
import dev.zrdzn.finance.backend.vault.VaultPermission
import dev.zrdzn.finance.backend.vault.VaultService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ProductService(
    private val productRepository: ProductRepository,
    private val categoryService: CategoryService,
    private val vaultService: VaultService,
    private val auditService: AuditService
) {

    @Transactional
    fun createProduct(requesterId: Int, name: String, vaultId: Int, categoryId: Int?): ProductResponse {
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
    fun updateProduct(requesterId: Int, productId: Int, categoryId: Int?) {
        val product = productRepository.findById(productId) ?: throw ProductNotFoundError()

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
    fun deleteProduct(requesterId: Int, productId: Int) {
        val product = productRepository.findById(productId) ?: throw ProductNotFoundError()

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
    fun getProducts(requesterId: Int, vaultId: Int): ProductListResponse =
        productRepository
            .findByVaultId(vaultId)
            .map { it.toResponse(it.categoryId?.let { id -> categoryService.getCategoryById(requesterId, id) }?.name) }
            .toSet()
            .let { ProductListResponse(it) }

    @Transactional(readOnly = true)
    fun getProduct(requesterId: Int, productId: Int): ProductResponse =
        productRepository
            .findById(productId)
            ?.let {
                vaultService.authorizeMember(it.vaultId, requesterId, VaultPermission.PRODUCT_READ)

                it.toResponse(it.categoryId?.let { id -> categoryService.getCategoryById(requesterId, id) }?.name)
            }
            ?: throw ProductNotFoundError()

}
