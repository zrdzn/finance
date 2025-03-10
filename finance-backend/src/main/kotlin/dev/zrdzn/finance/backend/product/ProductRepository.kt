package dev.zrdzn.finance.backend.product

import org.springframework.data.repository.Repository

interface ProductRepository : Repository<Product, Int> {

    fun save(product: Product): Product

    fun deleteById(productId: Int)

    fun findById(productId: Int): Product?

    fun findByVaultId(vaultId: Int): Set<Product>

}