package dev.zrdzn.finance.backend.vault

import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface VaultRepository : Repository<Vault, Int> {

    fun save(vault: Vault): Vault

    fun findById(vaultId: Int): Vault?

    fun findByPublicId(publicId: String): Vault?

    fun deleteById(vaultId: Int)

}