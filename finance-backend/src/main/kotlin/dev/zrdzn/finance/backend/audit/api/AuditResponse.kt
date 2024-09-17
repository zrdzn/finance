package dev.zrdzn.finance.backend.audit.api

import dev.zrdzn.finance.backend.audit.AuditId
import dev.zrdzn.finance.backend.vault.api.VaultMemberResponse
import java.time.Instant

data class AuditResponse(
    val id: AuditId,
    val createdAt: Instant,
    val vaultMember: VaultMemberResponse,
    val description: String
)
