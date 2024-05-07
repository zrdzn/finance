package dev.zrdzn.finance.backend.common.product

interface ProductPriceRepository {

    fun save(productPrice: ProductPrice): ProductPrice

    fun deleteById(productPriceId: ProductPriceId)

    fun findByProductId(productId: ProductId): Set<ProductPrice>

}