package dev.zrdzn.finance.backend.common.category

import dev.zrdzn.finance.backend.common.vault.VaultId

interface CategoryRepository {

    fun save(category: Category): Category

    fun deleteById(categoryId: CategoryId)

    fun findAllByVaultId(vaultId: VaultId): Set<Category>

}