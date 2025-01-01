package dev.zrdzn.finance.backend.vault.domain

interface VaultRepository {

    fun save(vault: Vault): Vault

    fun findById(vaultId: Int): Vault?

    fun findByPublicId(publicId: String): Vault?

    fun deleteById(vaultId: Int)

}