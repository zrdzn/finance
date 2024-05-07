package dev.zrdzn.finance.backend.common.product.application

import dev.zrdzn.finance.backend.common.product.ProductPriceRepository
import dev.zrdzn.finance.backend.common.product.ProductRepository
import dev.zrdzn.finance.backend.common.product.ProductService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class ProductApplicationConfiguration(
    private val productRepository: ProductRepository,
    private val productPriceRepository: ProductPriceRepository
) {

    @Bean
    fun productService(): ProductService = ProductService(
        productRepository = productRepository,
        productPriceRepository = productPriceRepository
    )

}