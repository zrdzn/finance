package dev.zrdzn.finance.backend.vault.domain

interface VaultMemberRepository {

    fun save(vaultMember: VaultMember): VaultMember

    fun findById(vaultMemberId: Int): VaultMember?

    fun findByVaultId(vaultId: Int): Set<VaultMember>

    fun findByVaultIdAndUserId(vaultId: Int, userId: Int): VaultMember?

    fun findVaultsByUserId(userId: Int): Set<Vault>

    fun deleteByVaultIdAndUserId(vaultId: Int, userId: Int)

}