package dev.zrdzn.finance.backend.audit

import dev.zrdzn.finance.backend.vault.VaultId

interface AuditRepository {

    fun save(audit: Audit): Audit

    fun findByVaultId(vaultId: VaultId): Set<Audit>

}