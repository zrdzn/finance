package dev.zrdzn.finance.backend.audit.api

import dev.zrdzn.finance.backend.audit.AuditId
import dev.zrdzn.finance.backend.user.api.UserResponse
import dev.zrdzn.finance.backend.vault.api.VaultResponse
import java.time.Instant

data class AuditResponse(
    val id: AuditId,
    val createdAt: Instant,
    val vault: VaultResponse,
    val user: UserResponse,
    val auditAction: AuditAction,
    val description: String
)
