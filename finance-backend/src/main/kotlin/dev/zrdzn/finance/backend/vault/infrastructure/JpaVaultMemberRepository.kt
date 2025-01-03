package dev.zrdzn.finance.backend.vault.infrastructure

import dev.zrdzn.finance.backend.vault.domain.Vault
import dev.zrdzn.finance.backend.vault.domain.VaultMember
import dev.zrdzn.finance.backend.vault.domain.VaultMemberRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.Repository
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Component

@Component
interface JpaVaultMemberRepository : VaultMemberRepository, Repository<VaultMember, Int> {

    @Query("SELECT vault FROM Vault vault JOIN VaultMember vaultMember ON vault.id = vaultMember.vaultId WHERE vaultMember.userId = :userId")
    override fun findVaultsByUserId(@Param("userId") userId: Int): Set<Vault>

}