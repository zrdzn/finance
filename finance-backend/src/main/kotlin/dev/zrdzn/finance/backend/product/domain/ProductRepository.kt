package dev.zrdzn.finance.backend.product.domain

interface ProductRepository {

    fun save(product: Product): Product

    fun deleteById(productId: Int)

    fun findById(productId: Int): Product?

    fun findByVaultId(vaultId: Int): Set<Product>

}