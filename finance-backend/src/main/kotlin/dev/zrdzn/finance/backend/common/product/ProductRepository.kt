package dev.zrdzn.finance.backend.common.product

interface ProductRepository {

    fun save(product: Product): Product

}