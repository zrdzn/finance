package dev.zrdzn.finance.backend.product

import dev.zrdzn.finance.backend.category.CategorySpecification
import dev.zrdzn.finance.backend.product.application.response.ProductResponse
import dev.zrdzn.finance.backend.product.application.ProductService
import dev.zrdzn.finance.backend.product.domain.ProductRepository

open class ProductSpecification : CategorySpecification() {

    protected val productService: ProductService get() = application.getBean(ProductService::class.java)
    protected val productRepository: ProductRepository get() = application.getBean(ProductRepository::class.java)

    fun createProduct(
        requesterId: Int,
        name: String,
        vaultId: Int,
        categoryId: Int?
    ): ProductResponse =
        productService.createProduct(
            requesterId = requesterId,
            name = name,
            vaultId = vaultId,
            categoryId = categoryId
        )

}