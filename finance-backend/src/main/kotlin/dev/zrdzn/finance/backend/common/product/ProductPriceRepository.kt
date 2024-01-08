package dev.zrdzn.finance.backend.common.product

interface ProductPriceRepository {

    fun save(productPrice: ProductPrice): ProductPrice

}