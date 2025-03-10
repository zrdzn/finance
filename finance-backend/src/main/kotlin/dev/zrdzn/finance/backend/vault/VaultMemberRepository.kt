package dev.zrdzn.finance.backend.vault

import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.Repository
import org.springframework.data.repository.query.Param

interface VaultMemberRepository : Repository<VaultMember, Int> {

    fun save(vaultMember: VaultMember): VaultMember

    fun findById(vaultMemberId: Int): VaultMember?

    fun findByVaultId(vaultId: Int): Set<VaultMember>

    fun findByVaultIdAndUserId(vaultId: Int, userId: Int): VaultMember?

    @Query("SELECT vault FROM Vault vault JOIN VaultMember vaultMember ON vault.id = vaultMember.vaultId WHERE vaultMember.userId = :userId")
    fun findVaultsByUserId(@Param("userId") userId: Int): Set<Vault>

    fun deleteByVaultIdAndUserId(vaultId: Int, userId: Int)

}