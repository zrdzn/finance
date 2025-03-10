package dev.zrdzn.finance.backend.audit

import dev.zrdzn.finance.backend.audit.dto.AuditResponse
import dev.zrdzn.finance.backend.user.dto.UserResponse
import dev.zrdzn.finance.backend.vault.dto.VaultResponse

object AuditMapper {

    fun Audit.toResponse(vault: VaultResponse, user: UserResponse) = AuditResponse(
        id = this.id!!,
        createdAt = this.createdAt,
        vault = vault,
        user = user,
        auditAction = this.auditAction,
        description = this.description
    )

}