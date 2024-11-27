package dev.zrdzn.finance.backend.audit

interface AuditRepository {

    fun save(audit: Audit): Audit

    fun findByVaultId(vaultId: Int): Set<Audit>

}