package dev.zrdzn.finance.backend.common.product

interface ProductRepository {

    fun save(product: Product): Product

    fun deleteById(productId: Int)

    fun findByVaultId(vaultId: Int): Set<Product>

}