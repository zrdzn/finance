package dev.zrdzn.finance.backend.audit.application.response

import dev.zrdzn.finance.backend.audit.domain.AuditAction
import dev.zrdzn.finance.backend.user.application.response.UserResponse
import dev.zrdzn.finance.backend.vault.application.response.VaultResponse
import java.time.Instant

data class AuditResponse(
    val id: Int,
    val createdAt: Instant,
    val vault: VaultResponse,
    val user: UserResponse,
    val auditAction: AuditAction,
    val description: String
)
