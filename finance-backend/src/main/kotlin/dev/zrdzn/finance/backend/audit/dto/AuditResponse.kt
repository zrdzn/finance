package dev.zrdzn.finance.backend.audit.dto

import dev.zrdzn.finance.backend.audit.AuditAction
import dev.zrdzn.finance.backend.user.dto.UserResponse
import dev.zrdzn.finance.backend.vault.dto.VaultResponse
import java.time.Instant

data class AuditResponse(
    val id: Int,
    val createdAt: Instant,
    val vault: VaultResponse,
    val user: UserResponse,
    val auditAction: AuditAction,
    val description: String
)
