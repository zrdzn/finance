package dev.zrdzn.finance.backend.audit.application

import dev.zrdzn.finance.backend.audit.application.response.AuditResponse
import dev.zrdzn.finance.backend.audit.domain.Audit
import dev.zrdzn.finance.backend.user.application.response.UserResponse
import dev.zrdzn.finance.backend.vault.application.response.VaultResponse

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