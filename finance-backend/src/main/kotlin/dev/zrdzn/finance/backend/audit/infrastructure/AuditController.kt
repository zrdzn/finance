package dev.zrdzn.finance.backend.audit.infrastructure

import dev.zrdzn.finance.backend.audit.AuditService
import dev.zrdzn.finance.backend.audit.api.AuditListResponse
import dev.zrdzn.finance.backend.user.UserId
import dev.zrdzn.finance.backend.vault.VaultId
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/audits")
class AuditController(
    private val auditService: AuditService
) {

    @GetMapping("/{vaultId}")
    fun getAudits(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable vaultId: VaultId
    ): AuditListResponse = auditService.getAudits(requesterId = userId, vaultId = vaultId)

}
