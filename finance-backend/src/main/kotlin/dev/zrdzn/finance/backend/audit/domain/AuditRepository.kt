package dev.zrdzn.finance.backend.audit.domain

interface AuditRepository {

    fun save(audit: Audit): Audit

    fun findByVaultId(vaultId: Int): Set<Audit>

}