package dev.zrdzn.finance.backend.common.product

import dev.zrdzn.finance.backend.api.product.ProductCreateResponse
import dev.zrdzn.finance.backend.api.product.ProductListResponse
import dev.zrdzn.finance.backend.api.product.ProductNotFoundException
import dev.zrdzn.finance.backend.api.product.ProductResponse
import dev.zrdzn.finance.backend.common.category.CategoryId
import dev.zrdzn.finance.backend.common.category.CategoryService
import dev.zrdzn.finance.backend.common.vault.VaultId
import org.slf4j.LoggerFactory
import org.springframework.transaction.annotation.Transactional

open class ProductService(
    private val productRepository: ProductRepository,
    private val categoryService: CategoryService
) {

    private val logger = LoggerFactory.getLogger(ProductService::class.java)

    @Transactional
    open fun createProduct(name: String, vaultId: VaultId, categoryId: CategoryId?): ProductCreateResponse =
        productRepository
            .save(
                Product(
                    id = null,
                    name = name,
                    vaultId = vaultId,
                    categoryId = categoryId
                )
            )
            .also { logger.info("Successfully created product: $it") }
            .let {
                ProductCreateResponse(
                    id = it.id!!,
                    name = it.name,
                    vaultId = it.vaultId,
                    categoryId = it.categoryId
                )
            }

    @Transactional
    open fun updateProduct(productId: ProductId, categoryId: CategoryId?) {
        val product = productRepository.findById(productId) ?: throw ProductNotFoundException(productId)
        product.categoryId = categoryId
        logger.info("Successfully updated product: $product")
    }

    @Transactional
    open fun deleteProductById(productId: ProductId): Unit =
        productRepository.deleteById(productId)
            .also { logger.info("Successfully deleted product with id: $productId") }

    @Transactional(readOnly = true)
    open fun getProductsByVaultId(vaultId: VaultId): ProductListResponse =
        productRepository
            .findByVaultId(vaultId)
            .map {
                ProductResponse(
                    id = it.id!!,
                    name = it.name,
                    vaultId = it.vaultId,
                    categoryId = it.categoryId,
                    categoryName = it.categoryId?.let { categoryService.getCategoryById(it) }?.name
                )
            }
            .toSet()
            .let { ProductListResponse(it) }

    @Transactional(readOnly = true)
    open fun getProductById(productId: ProductId): ProductResponse =
        productRepository
            .findById(productId)
            ?.let {
                ProductResponse(
                    id = it.id!!,
                    name = it.name,
                    vaultId = it.vaultId,
                    categoryId = it.categoryId,
                    categoryName = it.categoryId?.let { categoryService.getCategoryById(it) }?.name
                )
            }
            ?: throw ProductNotFoundException(productId)

}