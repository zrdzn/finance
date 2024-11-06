package dev.zrdzn.finance.backend.product

import dev.zrdzn.finance.backend.audit.AuditService
import dev.zrdzn.finance.backend.audit.api.AuditAction
import dev.zrdzn.finance.backend.category.CategoryId
import dev.zrdzn.finance.backend.category.CategoryService
import dev.zrdzn.finance.backend.product.api.ProductCreateResponse
import dev.zrdzn.finance.backend.product.api.ProductListResponse
import dev.zrdzn.finance.backend.product.api.ProductNotFoundException
import dev.zrdzn.finance.backend.product.api.ProductResponse
import dev.zrdzn.finance.backend.user.UserId
import dev.zrdzn.finance.backend.vault.VaultId
import dev.zrdzn.finance.backend.vault.VaultService
import dev.zrdzn.finance.backend.vault.api.authority.VaultPermission
import org.slf4j.LoggerFactory
import org.springframework.transaction.annotation.Transactional

open class ProductService(
    private val productRepository: ProductRepository,
    private val categoryService: CategoryService,
    private val vaultService: VaultService,
    private val auditService: AuditService
) {

    private val logger = LoggerFactory.getLogger(ProductService::class.java)

    @Transactional
    open fun createProduct(requesterId: UserId, name: String, vaultId: VaultId, categoryId: CategoryId?): ProductCreateResponse {
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
            .also { logger.info("Successfully created product: $it") }
            .also {
                auditService.createAudit(
                    vaultId = vaultId,
                    userId = requesterId,
                    auditAction = AuditAction.PRODUCT_CREATED,
                    description = name
                )
            }
            .let {
                ProductCreateResponse(
                    id = it.id!!,
                    name = it.name,
                    vaultId = it.vaultId,
                    categoryId = it.categoryId
                )
            }
    }

    @Transactional
    open fun updateProduct(requesterId: UserId, productId: ProductId, categoryId: CategoryId?) {
        val product = productRepository.findById(productId) ?: throw ProductNotFoundException()

        vaultService.authorizeMember(product.vaultId, requesterId, VaultPermission.PRODUCT_UPDATE)

        product.categoryId = categoryId
        logger.info("Successfully updated product: $product")

        auditService.createAudit(
            vaultId = product.vaultId,
            userId = requesterId,
            auditAction = AuditAction.PRODUCT_UPDATED,
            description = product.name
        )
    }

    @Transactional
    open fun deleteProductById(requesterId: UserId, productId: ProductId) {
        val product = productRepository.findById(productId) ?: throw ProductNotFoundException()

        vaultService.authorizeMember(product.vaultId, requesterId, VaultPermission.PRODUCT_DELETE)

        productRepository.deleteById(productId)

        logger.info("Successfully deleted product with id: $productId")

        auditService.createAudit(
            vaultId = product.vaultId,
            userId = requesterId,
            auditAction = AuditAction.PRODUCT_DELETED,
            description = product.name
        )
    }

    @Transactional(readOnly = true)
    open fun getProductsByVaultId(requesterId: UserId, vaultId: VaultId): ProductListResponse =
        productRepository
            .findByVaultId(vaultId)
            .map {
                ProductResponse(
                    id = it.id!!,
                    name = it.name,
                    vaultId = it.vaultId,
                    categoryId = it.categoryId,
                    categoryName = it.categoryId?.let { categoryService.getCategoryById(requesterId, it) }?.name
                )
            }
            .toSet()
            .let { ProductListResponse(it) }

    @Transactional(readOnly = true)
    open fun getProductById(requesterId: UserId, productId: ProductId): ProductResponse =
        productRepository
            .findById(productId)
            ?.let {
                vaultService.authorizeMember(it.vaultId, requesterId, VaultPermission.PRODUCT_READ)

                ProductResponse(
                    id = it.id!!,
                    name = it.name,
                    vaultId = it.vaultId,
                    categoryId = it.categoryId,
                    categoryName = it.categoryId?.let { categoryService.getCategoryById(requesterId, it) }?.name
                )
            }
            ?: throw ProductNotFoundException()

}
