package dev.zrdzn.finance.backend.category

import org.springframework.data.repository.Repository

interface CategoryRepository : Repository<Category, Int> {

    fun save(category: Category): Category

    fun deleteById(categoryId: Int)

    fun findById(categoryId: Int): Category?

    fun findAllByVaultId(vaultId: Int): Set<Category>

}