package dev.zrdzn.finance.backend.product

import dev.zrdzn.finance.backend.audit.AuditAction
import dev.zrdzn.finance.backend.audit.AuditService
import dev.zrdzn.finance.backend.category.CategoryService
import dev.zrdzn.finance.backend.product.ProductMapper.toResponse
import dev.zrdzn.finance.backend.product.dto.ProductListResponse
import dev.zrdzn.finance.backend.product.dto.ProductResponse
import dev.zrdzn.finance.backend.product.error.ProductNotFoundError
import dev.zrdzn.finance.backend.vault.VaultPermission
import dev.zrdzn.finance.backend.vault.VaultService
import java.math.BigDecimal
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
    fun createProduct(requesterId: Int, name: String, vaultId: Int, categoryId: Int?, unitAmount: BigDecimal): ProductResponse {
        vaultService.authorizeMember(vaultId, requesterId, VaultPermission.PRODUCT_CREATE)

        return productRepository
            .save(
                Product(
                    id = null,
                    name = name,
                    vaultId = vaultId,
                    categoryId = categoryId,
                    unitAmount = unitAmount
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
            .toResponse(
                category = categoryId?.let { id -> categoryService.getCategoryById(requesterId, id) }
            )
    }

    @Transactional
    fun updateProduct(requesterId: Int, productId: Int, categoryId: Int?, unitAmount: BigDecimal) {
        val product = productRepository.findById(productId) ?: throw ProductNotFoundError()

        vaultService.authorizeMember(product.vaultId, requesterId, VaultPermission.PRODUCT_UPDATE)

        product.categoryId = categoryId
        product.unitAmount = unitAmount

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
            .map {
                it.toResponse(
                    category = it.categoryId?.let { id -> categoryService.getCategoryById(requesterId, id) }
                )
            }
            .toSet()
            .let { ProductListResponse(it) }

}
