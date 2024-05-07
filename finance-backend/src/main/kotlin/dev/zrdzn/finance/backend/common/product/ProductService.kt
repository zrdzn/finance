package dev.zrdzn.finance.backend.common.product

import dev.zrdzn.finance.backend.api.price.Price
import dev.zrdzn.finance.backend.api.product.ProductCreateResponse
import dev.zrdzn.finance.backend.api.product.ProductListResponse
import dev.zrdzn.finance.backend.api.product.ProductPriceCreateResponse
import dev.zrdzn.finance.backend.api.product.ProductPriceListResponse
import dev.zrdzn.finance.backend.api.product.ProductPriceResponse
import dev.zrdzn.finance.backend.api.product.ProductResponse
import dev.zrdzn.finance.backend.common.category.Category
import dev.zrdzn.finance.backend.common.category.CategoryId
import dev.zrdzn.finance.backend.common.category.CategoryRepository
import dev.zrdzn.finance.backend.common.vault.VaultId
import org.slf4j.LoggerFactory

class ProductService(
    private val productRepository: ProductRepository,
    private val productPriceRepository: ProductPriceRepository
) {

    private val logger = LoggerFactory.getLogger(ProductService::class.java)

    fun createProduct(name: String, vaultId: VaultId, categoryId: CategoryId?): ProductCreateResponse =
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

    fun createProductPrice(productId: ProductId, price: Price): ProductPriceCreateResponse =
        productPriceRepository
            .save(
                ProductPrice(
                    id = null,
                    productId = productId,
                    unitAmount = price.amount,
                    currency = price.currency
                )
            )
            .also { logger.info("Successfully created product price: $it") }
            .let {
                ProductPriceCreateResponse(
                    id = it.id!!
                )
            }

    fun deleteProductById(productId: ProductId): Unit =
        productRepository.deleteById(productId)
            .also { logger.info("Successfully deleted product with id: $productId") }

    fun deleteProductPriceById(productPriceId: ProductPriceId): Unit =
        productPriceRepository.deleteById(productPriceId)
            .also { logger.info("Successfully deleted product price with id: $productPriceId") }

    fun getProductsByVaultId(vaultId: VaultId): ProductListResponse =
        productRepository
            .findByVaultId(vaultId)
            .map {
                ProductResponse(
                    id = it.id!!,
                    name = it.name,
                    vaultId = it.vaultId,
                    categoryId = it.categoryId
                )
            }
            .toSet()
            .let { ProductListResponse(it) }

    fun getProductPricesByProductId(productId: ProductId): ProductPriceListResponse =
        productPriceRepository
            .findByProductId(productId)
            .map {
                ProductPriceResponse(
                    id = it.id!!,
                    productId = it.productId,
                    price = Price(
                        amount = it.unitAmount,
                        currency = it.currency
                    )
                )
            }
            .toSet()
            .let { ProductPriceListResponse(it) }

}