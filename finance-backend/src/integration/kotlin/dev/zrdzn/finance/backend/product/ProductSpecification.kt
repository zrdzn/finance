package dev.zrdzn.finance.backend.product

import dev.zrdzn.finance.backend.category.CategorySpecification
import dev.zrdzn.finance.backend.product.dto.ProductResponse
import java.math.BigDecimal

open class ProductSpecification : CategorySpecification() {

    protected val productService: ProductService get() = application.getBean(ProductService::class.java)
    protected val productRepository: ProductRepository get() = application.getBean(ProductRepository::class.java)

    fun createProduct(
        requesterId: Int,
        name: String,
        vaultId: Int,
        categoryId: Int?,
        unitAmount: BigDecimal
    ): ProductResponse =
        productService.createProduct(
            requesterId = requesterId,
            name = name,
            vaultId = vaultId,
            categoryId = categoryId,
            unitAmount = unitAmount
        )

}