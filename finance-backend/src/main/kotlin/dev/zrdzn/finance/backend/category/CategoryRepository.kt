package dev.zrdzn.finance.backend.category

interface CategoryRepository {

    fun save(category: Category): Category

    fun deleteById(categoryId: Int)

    fun findById(categoryId: Int): Category?

    fun findAllByVaultId(vaultId: Int): Set<Category>

}