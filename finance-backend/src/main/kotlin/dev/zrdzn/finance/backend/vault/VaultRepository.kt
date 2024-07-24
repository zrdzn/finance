package dev.zrdzn.finance.backend.vault

interface VaultRepository {

    fun save(vault: Vault): Vault

    fun findById(vaultId: VaultId): Vault?

    fun findByPublicId(publicId: VaultPublicId): Vault?

}