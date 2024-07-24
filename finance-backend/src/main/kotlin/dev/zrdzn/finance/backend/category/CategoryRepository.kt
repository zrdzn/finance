package dev.zrdzn.finance.backend.category

import dev.zrdzn.finance.backend.vault.VaultId

interface CategoryRepository {

    fun save(category: Category): Category

    fun deleteById(categoryId: CategoryId)

    fun findById(categoryId: CategoryId): Category?

    fun findAllByVaultId(vaultId: VaultId): Set<Category>

}