package dev.zrdzn.finance.backend.audit

import org.springframework.data.repository.Repository

interface AuditRepository : Repository<Audit, Int> {

    fun save(audit: Audit): Audit

    fun findByVaultId(vaultId: Int): Set<Audit>

}