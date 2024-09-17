package dev.zrdzn.finance.backend.category.infrastructure

import dev.zrdzn.finance.backend.audit.Audit
import dev.zrdzn.finance.backend.audit.AuditId
import dev.zrdzn.finance.backend.audit.AuditRepository
import dev.zrdzn.finance.backend.vault.VaultId
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.Repository
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Component

@Component
interface JpaAuditRepository : AuditRepository, Repository<Audit, AuditId> {

    @Query(
        """
        SELECT audit 
        FROM Audit audit 
        INNER JOIN VaultMember vaultMember ON audit.memberId = vaultMember.id 
        WHERE vaultMember.vaultId = :vaultId
        """
    )
    override fun findByVaultId(@Param("vaultId") vaultId: VaultId): Set<Audit>

}