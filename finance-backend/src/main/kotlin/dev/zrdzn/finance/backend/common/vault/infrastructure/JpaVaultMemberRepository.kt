package dev.zrdzn.finance.backend.common.vault.infrastructure

import dev.zrdzn.finance.backend.common.user.UserId
import dev.zrdzn.finance.backend.common.vault.Vault
import dev.zrdzn.finance.backend.common.vault.VaultMember
import dev.zrdzn.finance.backend.common.vault.VaultMemberId
import dev.zrdzn.finance.backend.common.vault.VaultMemberRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.Repository
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Component

@Component
interface JpaVaultMemberRepository : VaultMemberRepository, Repository<VaultMember, VaultMemberId> {

    @Query("SELECT vault FROM Vault vault JOIN VaultMember vaultMember ON vault.id = vaultMember.vaultId WHERE vaultMember.userId = :userId")
    override fun findVaultsByUserId(@Param("userId") userId: UserId): Set<Vault>

}